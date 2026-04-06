/**
 * Voice Management Commands
 */

import { SlashCommandBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { checkBotPermission, checkUserPermission } from '../utils/permissions.js';
import { createSuccessEmbed, createErrorEmbed } from '../utils/embeds.js';
import { logInfo } from '../utils/logger.js';

export default {
  data: new SlashCommandBuilder()
    .setName('voice')
    .setDescription('Voice channel management commands')
    .addSubcommand(subcommand =>
      subcommand
        .setName('move')
        .setDescription('Move a user to a voice channel')
        .addUserOption(option =>
          option
            .setName('user')
            .setDescription('User to move')
            .setRequired(true)
        )
        .addChannelOption(option =>
          option
            .setName('channel')
            .setDescription('Target voice channel')
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildVoice)
        )
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (!await checkUserPermission(interaction, PermissionFlagsBits.MoveMembers)) return;
    if (!await checkBotPermission(interaction, PermissionFlagsBits.MoveMembers)) return;

    await interaction.deferReply();

    try {
      if (subcommand === 'move') {
        const user = interaction.options.getUser('user');
        const targetChannel = interaction.options.getChannel('channel');

        const member = await interaction.guild.members.fetch(user.id).catch(() => null);
        if (!member) {
          return await interaction.editReply({
            embeds: [createErrorEmbed('❌ User Not Found', 'User is not a member of this server!')]
          });
        }

        if (!member.voice.channel) {
          return await interaction.editReply({
            embeds: [createErrorEmbed('❌ Not In Voice', 'This user is not in a voice channel!')]
          });
        }

        if (!targetChannel.isVoice()) {
          return await interaction.editReply({
            embeds: [createErrorEmbed('❌ Invalid Channel', 'Target channel is not a voice channel!')]
          });
        }

        const oldChannel = member.voice.channel;
        await member.voice.setChannel(targetChannel, `Moved by ${interaction.user.tag}`);

        logInfo(`User moved from ${oldChannel.name} to ${targetChannel.name}: ${user.tag}`);

        return await interaction.editReply({
          embeds: [createSuccessEmbed(
            '✅ User Moved',
            `Successfully moved ${member} from **${oldChannel.name}** to **${targetChannel.name}**`
          )]
        });
      }

    } catch (error) {
      console.error('Voice command error:', error);
      return await interaction.editReply({
        embeds: [createErrorEmbed(
          '❌ Error',
          'An error occurred while executing the command!'
        )]
      });
    }
  }
};
