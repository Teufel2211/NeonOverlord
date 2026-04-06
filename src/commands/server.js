/**
 * Server Management Commands
 */

import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { checkBotPermission, checkUserPermission } from '../utils/permissions.js';
import { createSuccessEmbed, createErrorEmbed } from '../utils/embeds.js';
import { logInfo } from '../utils/logger.js';

export default {
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('Server management commands')
    .addSubcommand(subcommand =>
      subcommand
        .setName('rename')
        .setDescription('Rename the server')
        .addStringOption(option =>
          option
            .setName('name')
            .setDescription('New server name')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('icon')
        .setDescription('Change server icon')
        .addAttachmentOption(option =>
          option
            .setName('image')
            .setDescription('Icon image (PNG, JPEG, GIF)')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('banner')
        .setDescription('Change server banner')
        .addAttachmentOption(option =>
          option
            .setName('image')
            .setDescription('Banner image (PNG, JPEG, GIF)')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('setafk')
        .setDescription('Set AFK channel')
        .addChannelOption(option =>
          option
            .setName('channel')
            .setDescription('Voice channel to set as AFK')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('setsystem')
        .setDescription('Set system message channel')
        .addChannelOption(option =>
          option
            .setName('channel')
            .setDescription('Text channel for system messages')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('info')
        .setDescription('Show server information')
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (!await checkUserPermission(interaction, PermissionFlagsBits.ManageGuild)) return;
    if (!await checkBotPermission(interaction, PermissionFlagsBits.ManageGuild)) return;

    await interaction.deferReply();

    try {
      if (subcommand === 'rename') {
        const newName = interaction.options.getString('name');

        if (newName.length < 2 || newName.length > 100) {
          return await interaction.editReply({
            embeds: [createErrorEmbed('❌ Invalid Name', 'Server name must be between 2 and 100 characters!')]
          });
        }

        const oldName = interaction.guild.name;
        await interaction.guild.setName(newName, `Renamed by ${interaction.user.tag}`);

        logInfo(`Server renamed: ${oldName} -> ${newName}`);

        return await interaction.editReply({
          embeds: [createSuccessEmbed(
            '✅ Server Renamed',
            `Successfully renamed server from **${oldName}** to **${newName}**`
          )]
        });
      }

      if (subcommand === 'icon') {
        const attachment = interaction.options.getAttachment('image');

        if (!['image/png', 'image/jpeg', 'image/gif'].includes(attachment.contentType)) {
          return await interaction.editReply({
            embeds: [createErrorEmbed('❌ Invalid File Type', 'Icon must be PNG, JPEG, or GIF!')]
          });
        }

        // Fetch the image data
        const response = await fetch(attachment.url);
        const buffer = await response.buffer();

        await interaction.guild.setIcon(buffer, `Icon changed by ${interaction.user.tag}`);

        logInfo(`Server icon changed by ${interaction.user.tag}`);

        return await interaction.editReply({
          embeds: [createSuccessEmbed(
            '✅ Server Icon Changed',
            'Successfully updated the server icon!'
          )]
        });
      }

      if (subcommand === 'banner') {
        const attachment = interaction.options.getAttachment('image');

        if (!['image/png', 'image/jpeg', 'image/gif'].includes(attachment.contentType)) {
          return await interaction.editReply({
            embeds: [createErrorEmbed('❌ Invalid File Type', 'Banner must be PNG, JPEG, or GIF!')]
          });
        }

        // Fetch the image data
        const response = await fetch(attachment.url);
        const buffer = await response.buffer();

        await interaction.guild.setBanner(buffer, `Banner changed by ${interaction.user.tag}`);

        logInfo(`Server banner changed by ${interaction.user.tag}`);

        return await interaction.editReply({
          embeds: [createSuccessEmbed(
            '✅ Server Banner Changed',
            'Successfully updated the server banner!'
          )]
        });
      }

      if (subcommand === 'setafk') {
        const channel = interaction.options.getChannel('channel');

        if (!channel.isVoice()) {
          return await interaction.editReply({
            embeds: [createErrorEmbed('❌ Invalid Channel', 'AFK channel must be a voice channel!')]
          });
        }

        await interaction.guild.setAFKChannel(channel, `AFK channel set by ${interaction.user.tag}`);

        logInfo(`AFK channel set to ${channel.name}`);

        return await interaction.editReply({
          embeds: [createSuccessEmbed(
            '✅ AFK Channel Set',
            `Successfully set AFK channel to **${channel.name}**`
          )]
        });
      }

      if (subcommand === 'setsystem') {
        const channel = interaction.options.getChannel('channel');

        if (!channel.isTextBased()) {
          return await interaction.editReply({
            embeds: [createErrorEmbed('❌ Invalid Channel', 'System channel must be a text channel!')]
          });
        }

        await interaction.guild.setSystemChannel(channel, `System channel set by ${interaction.user.tag}`);

        logInfo(`System channel set to ${channel.name}`);

        return await interaction.editReply({
          embeds: [createSuccessEmbed(
            '✅ System Channel Set',
            `Successfully set system channel to **${channel.name}**`
          )]
        });
      }

      if (subcommand === 'info') {
        const { EmbedBuilder } = await import('discord.js');

        const infoEmbed = new EmbedBuilder()
          .setColor('#0099FF')
          .setTitle(`📊 Server Information - ${interaction.guild.name}`)
          .addFields(
            { name: '🆔 Server ID', value: interaction.guild.id, inline: true },
            { name: '👤 Owner', value: `<@${interaction.guild.ownerId}>`, inline: true },
            { name: '👥 Members', value: `${interaction.guild.memberCount}`, inline: true },
            { name: '📅 Created', value: interaction.guild.createdAt.toLocaleDateString(), inline: true },
            { name: '📝 Description', value: interaction.guild.description || 'None', inline: false }
          )
          .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
          .setTimestamp();

        return await interaction.editReply({ embeds: [infoEmbed] });
      }

    } catch (error) {
      console.error('Server command error:', error);
      return await interaction.editReply({
        embeds: [createErrorEmbed(
          '❌ Error',
          'An error occurred while executing the command!'
        )]
      });
    }
  }
};
