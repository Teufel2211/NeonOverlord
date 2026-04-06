/**
 * Channel Create Command
 */

import { SlashCommandBuilder, ChannelType, PermissionFlagsBits } from 'discord.js';
import { checkBotPermission, checkUserPermission } from '../utils/permissions.js';
import { createSuccessEmbed, createErrorEmbed } from '../utils/embeds.js';
import { validateChannelName } from '../utils/validation.js';
import { logInfo } from '../utils/logger.js';

export default {
  data: new SlashCommandBuilder()
    .setName('channel')
    .setDescription('Channel management commands')
    .addSubcommand(subcommand =>
      subcommand
        .setName('create')
        .setDescription('Create a new text or voice channel')
        .addStringOption(option =>
          option
            .setName('name')
            .setDescription('Channel name')
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName('type')
            .setDescription('Channel type')
            .setRequired(true)
            .addChoices(
              { name: 'Text', value: 'text' },
              { name: 'Voice', value: 'voice' }
            )
        )
        .addChannelOption(option =>
          option
            .setName('category')
            .setDescription('Parent category')
            .setRequired(false)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('delete')
        .setDescription('Delete a channel')
        .addChannelOption(option =>
          option
            .setName('channel')
            .setDescription('Channel to delete')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('rename')
        .setDescription('Rename a channel')
        .addChannelOption(option =>
          option
            .setName('channel')
            .setDescription('Channel to rename')
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName('newname')
            .setDescription('New channel name')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('slowmode')
        .setDescription('Set channel slowmode')
        .addChannelOption(option =>
          option
            .setName('channel')
            .setDescription('Target channel')
            .setRequired(true)
        )
        .addIntegerOption(option =>
          option
            .setName('seconds')
            .setDescription('Slowmode in seconds (0 to disable)')
            .setRequired(true)
            .setMinValue(0)
            .setMaxValue(21600)
        )
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    // Permission checks
    if (!await checkUserPermission(interaction, PermissionFlagsBits.ManageChannels)) return;
    if (!await checkBotPermission(interaction, PermissionFlagsBits.ManageChannels)) return;

    await interaction.deferReply();

    try {
      if (subcommand === 'create') {
        const name = interaction.options.getString('name');
        const type = interaction.options.getString('type');
        const category = interaction.options.getChannel('category');

        if (!await validateChannelName(interaction, name)) return;

        const channelType = type === 'text' ? ChannelType.GuildText : ChannelType.GuildVoice;

        const newChannel = await interaction.guild.channels.create({
          name: name,
          type: channelType,
          parent: category?.id || null,
          reason: `Channel created by ${interaction.user.tag}`
        });

        logInfo(`Channel created: ${newChannel.name} (${newChannel.id})`);

        return await interaction.editReply({
          embeds: [createSuccessEmbed(
            '✅ Channel Created',
            `Successfully created ${type} channel: <#${newChannel.id}>`
          )]
        });
      }

      if (subcommand === 'delete') {
        const channel = interaction.options.getChannel('channel');

        if (!channel) {
          return await interaction.editReply({
            embeds: [createErrorEmbed('❌ Channel Not Found', 'Channel does not exist!')]
          });
        }

        const channelName = channel.name;
        await channel.delete(`Channel deleted by ${interaction.user.tag}`);

        logInfo(`Channel deleted: ${channelName}`);

        return await interaction.editReply({
          embeds: [createSuccessEmbed(
            '✅ Channel Deleted',
            `Successfully deleted channel: **${channelName}**`
          )]
        });
      }

      if (subcommand === 'rename') {
        const channel = interaction.options.getChannel('channel');
        const newName = interaction.options.getString('newname');

        if (!channel) {
          return await interaction.editReply({
            embeds: [createErrorEmbed('❌ Channel Not Found', 'Channel does not exist!')]
          });
        }

        if (!await validateChannelName(interaction, newName)) return;

        const oldName = channel.name;
        await channel.setName(newName, `Renamed by ${interaction.user.tag}`);

        logInfo(`Channel renamed: ${oldName} -> ${newName}`);

        return await interaction.editReply({
          embeds: [createSuccessEmbed(
            '✅ Channel Renamed',
            `Successfully renamed **${oldName}** to **${newName}**`
          )]
        });
      }

      if (subcommand === 'slowmode') {
        const channel = interaction.options.getChannel('channel');
        const seconds = interaction.options.getInteger('seconds');

        if (!channel) {
          return await interaction.editReply({
            embeds: [createErrorEmbed('❌ Channel Not Found', 'Channel does not exist!')]
          });
        }

        if (channel.isVoice()) {
          return await interaction.editReply({
            embeds: [createErrorEmbed(
              '❌ Invalid Channel Type',
              'Slowmode can only be set on text channels!'
            )]
          });
        }

        await channel.setRateLimitPerUser(seconds, `Slowmode set by ${interaction.user.tag}`);

        logInfo(`Slowmode set on ${channel.name} to ${seconds}s`);

        const status = seconds === 0 ? 'disabled' : `set to ${seconds} seconds`;
        return await interaction.editReply({
          embeds: [createSuccessEmbed(
            '✅ Slowmode Updated',
            `Slowmode on <#${channel.id}> has been ${status}`
          )]
        });
      }

    } catch (error) {
      console.error('Channel command error:', error);
      return await interaction.editReply({
        embeds: [createErrorEmbed(
          '❌ Error',
          'An error occurred while executing the command!'
        )]
      });
    }
  }
};
