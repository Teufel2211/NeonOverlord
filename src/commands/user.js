/**
 * User Management Commands
 */

import { SlashCommandBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { checkBotPermission, checkUserPermission } from '../utils/permissions.js';
import { createSuccessEmbed, createErrorEmbed } from '../utils/embeds.js';
import { logInfo } from '../utils/logger.js';

export default {
  data: new SlashCommandBuilder()
    .setName('user')
    .setDescription('User management commands')
    .addSubcommand(subcommand =>
      subcommand
        .setName('nickname')
        .setDescription('Change a user\' nickname')
        .addUserOption(option =>
          option
            .setName('user')
            .setDescription('Target user')
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName('newname')
            .setDescription('New nickname (or empty to remove)')
            .setRequired(false)
        )
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (!await checkUserPermission(interaction, PermissionFlagsBits.ManageNicknames)) return;
    if (!await checkBotPermission(interaction, PermissionFlagsBits.ManageNicknames)) return;

    await interaction.deferReply();

    try {
      if (subcommand === 'nickname') {
        const user = interaction.options.getUser('user');
        const newNickname = interaction.options.getString('newname') || null;

        const member = await interaction.guild.members.fetch(user.id).catch(() => null);
        if (!member) {
          return await interaction.editReply({
            embeds: [createErrorEmbed('❌ User Not Found', 'User is not a member of this server!')]
          });
        }

        if (member.id === interaction.guild.ownerId) {
          return await interaction.editReply({
            embeds: [createErrorEmbed('❌ Cannot Change', 'Cannot change the server owner\'s nickname!')]
          });
        }

        const oldNickname = member.nickname || member.user.username;
        await member.setNickname(newNickname, `Nickname changed by ${interaction.user.tag}`);

        logInfo(`Nickname changed: ${user.tag} - ${oldNickname} -> ${newNickname || 'reset'}`);

        return await interaction.editReply({
          embeds: [createSuccessEmbed(
            '✅ Nickname Changed',
            `Successfully changed ${member}'s nickname from **${oldNickname}** to **${newNickname || 'reset'}**`
          )]
        });
      }

    } catch (error) {
      console.error('User command error:', error);
      return await interaction.editReply({
        embeds: [createErrorEmbed(
          '❌ Error',
          'An error occurred while executing the command!'
        )]
      });
    }
  }
};
