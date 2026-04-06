/**
 * Role Management Command
 */

import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { checkBotPermission, checkUserPermission } from '../utils/permissions.js';
import { createSuccessEmbed, createErrorEmbed } from '../utils/embeds.js';
import { validateRoleName, validateHexColor, parseHexColor } from '../utils/validation.js';
import { logInfo } from '../utils/logger.js';

export default {
  data: new SlashCommandBuilder()
    .setName('role')
    .setDescription('Role management commands')
    .addSubcommand(subcommand =>
      subcommand
        .setName('create')
        .setDescription('Create a new role')
        .addStringOption(option =>
          option
            .setName('name')
            .setDescription('Role name')
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName('color')
            .setDescription('Role color (hex code, e.g., #FF0000)')
            .setRequired(false)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('delete')
        .setDescription('Delete a role')
        .addRoleOption(option =>
          option
            .setName('role')
            .setDescription('Role to delete')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('rename')
        .setDescription('Rename a role')
        .addRoleOption(option =>
          option
            .setName('role')
            .setDescription('Role to rename')
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName('newname')
            .setDescription('New role name')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('color')
        .setDescription('Change role color')
        .addRoleOption(option =>
          option
            .setName('role')
            .setDescription('Target role')
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName('color')
            .setDescription('Hex color code (e.g., #FF0000)')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('assign')
        .setDescription('Assign a role to a user')
        .addUserOption(option =>
          option
            .setName('user')
            .setDescription('Target user')
            .setRequired(true)
        )
        .addRoleOption(option =>
          option
            .setName('role')
            .setDescription('Role to assign')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('Remove a role from a user')
        .addUserOption(option =>
          option
            .setName('user')
            .setDescription('Target user')
            .setRequired(true)
        )
        .addRoleOption(option =>
          option
            .setName('role')
            .setDescription('Role to remove')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('adminify')
        .setDescription('Give a user admin role')
        .addUserOption(option =>
          option
            .setName('user')
            .setDescription('User to adminify')
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (!await checkUserPermission(interaction, PermissionFlagsBits.ManageRoles)) return;
    if (!await checkBotPermission(interaction, PermissionFlagsBits.ManageRoles)) return;

    await interaction.deferReply();

    try {
      if (subcommand === 'create') {
        const name = interaction.options.getString('name');
        const color = interaction.options.getString('color');

        if (!await validateRoleName(interaction, name)) return;

        let colorValue = null;
        if (color) {
          if (!await validateHexColor(interaction, color)) return;
          colorValue = parseHexColor(color);
        }

        const role = await interaction.guild.roles.create({
          name: name,
          color: colorValue,
          reason: `Role created by ${interaction.user.tag}`
        });

        logInfo(`Role created: ${role.name} (${role.id})`);

        return await interaction.editReply({
          embeds: [createSuccessEmbed(
            '✅ Role Created',
            `Successfully created role: <@&${role.id}>`
          )]
        });
      }

      if (subcommand === 'delete') {
        const role = interaction.options.getRole('role');

        if (!role) {
          return await interaction.editReply({
            embeds: [createErrorEmbed('❌ Role Not Found', 'Role does not exist!')]
          });
        }

        if (role.managed) {
          return await interaction.editReply({
            embeds: [createErrorEmbed('❌ Cannot Delete', 'Cannot delete managed roles (bot roles)!')]
          });
        }

        const roleName = role.name;
        await role.delete(`Role deleted by ${interaction.user.tag}`);

        logInfo(`Role deleted: ${roleName}`);

        return await interaction.editReply({
          embeds: [createSuccessEmbed(
            '✅ Role Deleted',
            `Successfully deleted role: **${roleName}**`
          )]
        });
      }

      if (subcommand === 'rename') {
        const role = interaction.options.getRole('role');
        const newName = interaction.options.getString('newname');

        if (!role) {
          return await interaction.editReply({
            embeds: [createErrorEmbed('❌ Role Not Found', 'Role does not exist!')]
          });
        }

        if (!await validateRoleName(interaction, newName)) return;

        const oldName = role.name;
        await role.setName(newName, `Renamed by ${interaction.user.tag}`);

        logInfo(`Role renamed: ${oldName} -> ${newName}`);

        return await interaction.editReply({
          embeds: [createSuccessEmbed(
            '✅ Role Renamed',
            `Successfully renamed **${oldName}** to **${newName}**`
          )]
        });
      }

      if (subcommand === 'color') {
        const role = interaction.options.getRole('role');
        const color = interaction.options.getString('color');

        if (!role) {
          return await interaction.editReply({
            embeds: [createErrorEmbed('❌ Role Not Found', 'Role does not exist!')]
          });
        }

        if (!await validateHexColor(interaction, color)) return;

        const colorValue = parseHexColor(color);
        await role.setColor(colorValue, `Color changed by ${interaction.user.tag}`);

        logInfo(`Role color changed: ${role.name} -> ${color}`);

        return await interaction.editReply({
          embeds: [createSuccessEmbed(
            '✅ Role Color Changed',
            `Successfully changed color of <@&${role.id}> to **${color}**`
          )]
        });
      }

      if (subcommand === 'assign') {
        const user = interaction.options.getUser('user');
        const role = interaction.options.getRole('role');

        const member = await interaction.guild.members.fetch(user.id).catch(() => null);
        if (!member) {
          return await interaction.editReply({
            embeds: [createErrorEmbed('❌ User Not Found', 'User is not a member of this server!')]
          });
        }

        if (member.roles.cache.has(role.id)) {
          return await interaction.editReply({
            embeds: [createErrorEmbed(
              '❌ Already Has Role',
              `${member} already has <@&${role.id}>!`
            )]
          });
        }

        await member.roles.add(role, `Role assigned by ${interaction.user.tag}`);

        logInfo(`Role assigned: ${user.tag} -> ${role.name}`);

        return await interaction.editReply({
          embeds: [createSuccessEmbed(
            '✅ Role Assigned',
            `Successfully assigned <@&${role.id}> to ${member}`
          )]
        });
      }

      if (subcommand === 'remove') {
        const user = interaction.options.getUser('user');
        const role = interaction.options.getRole('role');

        const member = await interaction.guild.members.fetch(user.id).catch(() => null);
        if (!member) {
          return await interaction.editReply({
            embeds: [createErrorEmbed('❌ User Not Found', 'User is not a member of this server!')]
          });
        }

        if (!member.roles.cache.has(role.id)) {
          return await interaction.editReply({
            embeds: [createErrorEmbed(
              '❌ Doesnt Have Role',
              `${member} doesn't have <@&${role.id}>!`
            )]
          });
        }

        await member.roles.remove(role, `Role removed by ${interaction.user.tag}`);

        logInfo(`Role removed: ${user.tag} -> ${role.name}`);

        return await interaction.editReply({
          embeds: [createSuccessEmbed(
            '✅ Role Removed',
            `Successfully removed <@&${role.id}> from ${member}`
          )]
        });
      }

      if (subcommand === 'adminify') {
        const user = interaction.options.getUser('user');

        const member = await interaction.guild.members.fetch(user.id).catch(() => null);
        if (!member) {
          return await interaction.editReply({
            embeds: [createErrorEmbed('❌ User Not Found', 'User is not a member of this server!')]
          });
        }

        // Create admin role
        const adminRole = await interaction.guild.roles.create({
          name: 'Admin',
          permissions: [PermissionFlagsBits.Administrator],
          reason: `Admin role created for ${interaction.user.tag}`
        });

        await member.roles.add(adminRole, `Admin role assigned by ${interaction.user.tag}`);

        logInfo(`User adminified: ${user.tag}`);

        return await interaction.editReply({
          embeds: [createSuccessEmbed(
            '✅ User Adminified',
            `Successfully gave admin permissions to ${member} via <@&${adminRole.id}>`
          )]
        });
      }

    } catch (error) {
      console.error('Role command error:', error);
      return await interaction.editReply({
        embeds: [createErrorEmbed(
          '❌ Error',
          'An error occurred while executing the command!'
        )]
      });
    }
  }
};
