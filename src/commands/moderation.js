/**
 * Moderation Commands
 */

import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { checkBotPermission, checkUserPermission } from '../utils/permissions.js';
import { createSuccessEmbed, createErrorEmbed, createLogEmbed } from '../utils/embeds.js';
import { validateDuration } from '../utils/validation.js';
import { logInfo } from '../utils/logger.js';

export default {
  data: new SlashCommandBuilder()
    .setName('moderation')
    .setDescription('Moderation and user management commands')
    .addSubcommand(subcommand =>
      subcommand
        .setName('kick')
        .setDescription('Kick a user from the server')
        .addUserOption(option =>
          option
            .setName('user')
            .setDescription('User to kick')
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName('reason')
            .setDescription('Kick reason')
            .setRequired(false)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('ban')
        .setDescription('Ban a user from the server')
        .addUserOption(option =>
          option
            .setName('user')
            .setDescription('User to ban')
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName('reason')
            .setDescription('Ban reason')
            .setRequired(false)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('unban')
        .setDescription('Unban a user from the server')
        .addStringOption(option =>
          option
            .setName('userid')
            .setDescription('User ID to unban')
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName('reason')
            .setDescription('Unban reason')
            .setRequired(false)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('timeout')
        .setDescription('Timeout a user')
        .addUserOption(option =>
          option
            .setName('user')
            .setDescription('User to timeout')
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName('duration')
            .setDescription('Duration (e.g., 10s, 5m, 2h, 1d)')
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName('reason')
            .setDescription('Timeout reason')
            .setRequired(false)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('removetimeout')
        .setDescription('Remove timeout from a user')
        .addUserOption(option =>
          option
            .setName('user')
            .setDescription('User to remove timeout')
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName('reason')
            .setDescription('Removal reason')
            .setRequired(false)
        )
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (!await checkUserPermission(interaction, PermissionFlagsBits.ModerateMembers)) return;
    if (!await checkBotPermission(interaction, PermissionFlagsBits.ModerateMembers)) return;

    await interaction.deferReply();

    try {
      // Find or create server-logs channel
      let logChannel = interaction.guild.channels.cache.find(ch => ch.name === 'server-logs');

      if (subcommand === 'kick') {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (user.id === interaction.guild.ownerId) {
          return await interaction.editReply({
            embeds: [createErrorEmbed('❌ Cannot Kick', 'Cannot kick the server owner!')]
          });
        }

        const member = await interaction.guild.members.fetch(user.id).catch(() => null);
        if (!member) {
          return await interaction.editReply({
            embeds: [createErrorEmbed('❌ User Not Found', 'User is not a member of this server!')]
          });
        }

        await member.kick(reason);

        logInfo(`User kicked: ${user.tag} - Reason: ${reason}`);

        if (logChannel) {
          await logChannel.send({
            embeds: [createLogEmbed(
              'User Kicked',
              user.tag,
              `**Reason:** ${reason}\n**moderator:** ${interaction.user.tag}`
            )]
          });
        }

        return await interaction.editReply({
          embeds: [createSuccessEmbed(
            '✅ User Kicked',
            `Successfully kicked ${user.tag}\n**Reason:** ${reason}`
          )]
        });
      }

      if (subcommand === 'ban') {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (user.id === interaction.guild.ownerId) {
          return await interaction.editReply({
            embeds: [createErrorEmbed('❌ Cannot Ban', 'Cannot ban the server owner!')]
          });
        }

        const member = await interaction.guild.members.fetch(user.id).catch(() => null);
        if (member && !member.bannable) {
          return await interaction.editReply({
            embeds: [createErrorEmbed('❌ Cannot Ban', 'This user cannot be banned!')]
          });
        }

        await interaction.guild.members.ban(user.id, { reason });

        logInfo(`User banned: ${user.tag} - Reason: ${reason}`);

        if (logChannel) {
          await logChannel.send({
            embeds: [createLogEmbed(
              'User Banned',
              user.tag,
              `**Reason:** ${reason}\n**Moderator:** ${interaction.user.tag}`
            )]
          });
        }

        return await interaction.editReply({
          embeds: [createSuccessEmbed(
            '✅ User Banned',
            `Successfully banned ${user.tag}\n**Reason:** ${reason}`
          )]
        });
      }

      if (subcommand === 'unban') {
        const userId = interaction.options.getString('userid');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        try {
          await interaction.guild.members.unban(userId, reason);

          logInfo(`User unbanned: ${userId} - Reason: ${reason}`);

          if (logChannel) {
            await logChannel.send({
              embeds: [createLogEmbed(
                'User Unbanned',
                userId,
                `**Reason:** ${reason}\n**Moderator:** ${interaction.user.tag}`
              )]
            });
          }

          return await interaction.editReply({
            embeds: [createSuccessEmbed(
              '✅ User Unbanned',
              `Successfully unbanned user ID: ${userId}\n**Reason:** ${reason}`
            )]
          });
        } catch (error) {
          return await interaction.editReply({
            embeds: [createErrorEmbed('❌ Error', 'User not found in bans!')]
          });
        }
      }

      if (subcommand === 'timeout') {
        const user = interaction.options.getUser('user');
        const durationStr = interaction.options.getString('duration');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        const duration = await validateDuration(interaction, durationStr);
        if (!duration) return;

        const member = await interaction.guild.members.fetch(user.id).catch(() => null);
        if (!member) {
          return await interaction.editReply({
            embeds: [createErrorEmbed('❌ User Not Found', 'User is not a member of this server!')]
          });
        }

        if (!member.moderatable) {
          return await interaction.editReply({
            embeds: [createErrorEmbed('❌ Cannot Timeout', 'This user cannot be timed out!')]
          });
        }

        await member.timeout(duration, reason);

        logInfo(`User timeout: ${user.tag} - Duration: ${durationStr} - Reason: ${reason}`);

        if (logChannel) {
          await logChannel.send({
            embeds: [createLogEmbed(
              'User Timeout',
              user.tag,
              `**Duration:** ${durationStr}\n**Reason:** ${reason}\n**Moderator:** ${interaction.user.tag}`
            )]
          });
        }

        return await interaction.editReply({
          embeds: [createSuccessEmbed(
            '✅ User Timed Out',
            `Successfully timed out ${user.tag} for ${durationStr}\n**Reason:** ${reason}`
          )]
        });
      }

      if (subcommand === 'removetimeout') {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        const member = await interaction.guild.members.fetch(user.id).catch(() => null);
        if (!member) {
          return await interaction.editReply({
            embeds: [createErrorEmbed('❌ User Not Found', 'User is not a member of this server!')]
          });
        }

        if (!member.isCommunicationDisabled()) {
          return await interaction.editReply({
            embeds: [createErrorEmbed('❌ Not Timed Out', 'This user is not timed out!')]
          });
        }

        await member.timeout(null, reason);

        logInfo(`Timeout removed: ${user.tag} - Reason: ${reason}`);

        if (logChannel) {
          await logChannel.send({
            embeds: [createLogEmbed(
              'Timeout Removed',
              user.tag,
              `**Reason:** ${reason}\n**Moderator:** ${interaction.user.tag}`
            )]
          });
        }

        return await interaction.editReply({
          embeds: [createSuccessEmbed(
            '✅ Timeout Removed',
            `Successfully removed timeout from ${user.tag}\n**Reason:** ${reason}`
          )]
        });
      }

    } catch (error) {
      console.error('Moderation command error:', error);
      return await interaction.editReply({
        embeds: [createErrorEmbed(
          '❌ Error',
          'An error occurred while executing the command!'
        )]
      });
    }
  }
};
