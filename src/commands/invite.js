/**
 * Invite Management Commands
 */

import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { checkBotPermission, checkUserPermission } from '../utils/permissions.js';
import { createSuccessEmbed, createErrorEmbed, createInfoEmbed } from '../utils/embeds.js';
import {
  trackInvite,
  getInviteInfo,
  getAllGuildInvites,
  deleteInviteRecord
} from '../utils/inviteManager.js';
import { logInfo } from '../utils/logger.js';

export default {
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Invite management commands')
    .addSubcommand(subcommand =>
      subcommand
        .setName('create')
        .setDescription('Create an invite link')
        .addChannelOption(option =>
          option
            .setName('channel')
            .setDescription('Channel for the invite')
            .setRequired(true)
        )
        .addIntegerOption(option =>
          option
            .setName('maxuses')
            .setDescription('Max uses (0 = unlimited)')
            .setRequired(false)
            .setMinValue(0)
            .setMaxValue(100)
        )
        .addIntegerOption(option =>
          option
            .setName('expire')
            .setDescription('Expire time in hours (0 = never)')
            .setRequired(false)
            .setMinValue(0)
            .setMaxValue(168)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('delete')
        .setDescription('Delete an invite')
        .addStringOption(option =>
          option
            .setName('code')
            .setDescription('Invite code to delete')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('track')
        .setDescription('Show all tracked invites and their usage')
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (!await checkUserPermission(interaction, PermissionFlagsBits.ManageGuild)) return;
    if (!await checkBotPermission(interaction, PermissionFlagsBits.ManageGuild)) return;

    await interaction.deferReply();

    try {
      if (subcommand === 'create') {
        const channel = interaction.options.getChannel('channel');
        const maxUses = interaction.options.getInteger('maxuses') ?? 0;
        const expire = interaction.options.getInteger('expire') ?? 0;

        const invite = await channel.createInvite({
          maxUses: maxUses,
          maxAge: expire * 3600000, // Convert hours to milliseconds
          reason: `Invite created by ${interaction.user.tag}`
        });

        // Track the invite
        trackInvite(interaction.guildId, invite.code, interaction.user.id);

        logInfo(`Invite created: ${invite.code} for ${channel.name}`);

        const maxUsesText = maxUses === 0 ? 'Unlimited' : maxUses;
        const expireText = expire === 0 ? 'Never' : `${expire} hours`;

        return await interaction.editReply({
          embeds: [createSuccessEmbed(
            '✅ Invite Created',
            `**Invite Link:** https://discord.gg/${invite.code}\n**Channel:** ${channel}\n**Max Uses:** ${maxUsesText}\n**Expires:** ${expireText}`
          )]
        });
      }

      if (subcommand === 'delete') {
        const code = interaction.options.getString('code');

        try {
          const invite = await interaction.client.fetchInvite(code);
          await invite.delete(`Deleted by ${interaction.user.tag}`);

          // Remove from tracking
          deleteInviteRecord(interaction.guildId, code);

          logInfo(`Invite deleted: ${code}`);

          return await interaction.editReply({
            embeds: [createSuccessEmbed(
              '✅ Invite Deleted',
              `Successfully deleted invite: **${code}**`
            )]
          });
        } catch (error) {
          return await interaction.editReply({
            embeds: [createErrorEmbed(
              '❌ Invalid Invite',
              'Invite code not found or already deleted!'
            )]
          });
        }
      }

      if (subcommand === 'track') {
        const allInvites = getAllGuildInvites(interaction.guildId);

        if (Object.keys(allInvites).length === 0) {
          return await interaction.editReply({
            embeds: [createInfoEmbed(
              '📋 Invite Tracking',
              'No invites have been created yet!'
            )]
          });
        }

        let description = '';
        for (const [code, info] of Object.entries(allInvites)) {
          if (code === '__first_join__') continue;

          const usedCount = info.usedBy.length;
          const createdDate = info.createdAt.toLocaleDateString();
          description += `**${code}**\n📊 Used: ${usedCount} time(s)\n📅 Created: ${createdDate}\n\n`;
        }

        return await interaction.editReply({
          embeds: [createInfoEmbed(
            '📋 Invite Tracking',
            description || 'No invites to display!'
          )]
        });
      }

    } catch (error) {
      console.error('Invite command error:', error);
      return await interaction.editReply({
        embeds: [createErrorEmbed(
          '❌ Error',
          'An error occurred while executing the command!'
        )]
      });
    }
  }
};
