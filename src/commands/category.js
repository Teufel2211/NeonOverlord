/**
 * Category Management Command
 */

import { SlashCommandBuilder, ChannelType, PermissionFlagsBits } from 'discord.js';
import { checkBotPermission, checkUserPermission } from '../utils/permissions.js';
import { createSuccessEmbed, createErrorEmbed } from '../utils/embeds.js';
import { validateChannelName } from '../utils/validation.js';
import { logInfo } from '../utils/logger.js';

export default {
  data: new SlashCommandBuilder()
    .setName('category')
    .setDescription('Category management commands')
    .addSubcommand(subcommand =>
      subcommand
        .setName('create')
        .setDescription('Create a new category')
        .addStringOption(option =>
          option
            .setName('name')
            .setDescription('Category name')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('delete')
        .setDescription('Delete a category')
        .addChannelOption(option =>
          option
            .setName('category')
            .setDescription('Category to delete')
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (!await checkUserPermission(interaction, PermissionFlagsBits.ManageChannels)) return;
    if (!await checkBotPermission(interaction, PermissionFlagsBits.ManageChannels)) return;

    await interaction.deferReply();

    try {
      if (subcommand === 'create') {
        const name = interaction.options.getString('name');

        if (!await validateChannelName(interaction, name)) return;

        const category = await interaction.guild.channels.create({
          name: name,
          type: ChannelType.GuildCategory,
          reason: `Category created by ${interaction.user.tag}`
        });

        logInfo(`Category created: ${category.name} (${category.id})`);

        return await interaction.editReply({
          embeds: [createSuccessEmbed(
            '✅ Category Created',
            `Successfully created category: **${category.name}**`
          )]
        });
      }

      if (subcommand === 'delete') {
        const category = interaction.options.getChannel('category');

        if (!category) {
          return await interaction.editReply({
            embeds: [createErrorEmbed('❌ Category Not Found', 'Category does not exist!')]
          });
        }

        if (!category.isCategory()) {
          return await interaction.editReply({
            embeds: [createErrorEmbed('❌ Invalid Channel Type', 'This is not a category!')]
          });
        }

        const categoryName = category.name;
        await category.delete(`Category deleted by ${interaction.user.tag}`);

        logInfo(`Category deleted: ${categoryName}`);

        return await interaction.editReply({
          embeds: [createSuccessEmbed(
            '✅ Category Deleted',
            `Successfully deleted category: **${categoryName}**`
          )]
        });
      }

    } catch (error) {
      console.error('Category command error:', error);
      return await interaction.editReply({
        embeds: [createErrorEmbed(
          '❌ Error',
          'An error occurred while executing the command!'
        )]
      });
    }
  }
};
