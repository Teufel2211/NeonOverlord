/**
 * Permission Utility
 * Handles permission checks and validations
 */

import { PermissionFlagsBits } from 'discord.js';
import { createErrorEmbed } from './embeds.js';

export async function checkBotPermission(interaction, permission) {
  const botMember = await interaction.guild.members.fetchMe();
  
  if (!botMember.permissions.has(permission)) {
    await interaction.reply({
      embeds: [createErrorEmbed(
        '❌ Permission Denied',
        `I don't have the **${getPermissionName(permission)}** permission!`
      )],
      ephemeral: true
    });
    return false;
  }
  
  return true;
}

export async function checkUserPermission(interaction, permission) {
  if (!interaction.member.permissions.has(permission)) {
    await interaction.reply({
      embeds: [createErrorEmbed(
        '❌ Permission Denied',
        `You don't have the **${getPermissionName(permission)}** permission!`
      )],
      ephemeral: true
    });
    return false;
  }
  
  return true;
}

export function getPermissionName(permission) {
  const permissionNames = {
    [PermissionFlagsBits.Administrator]: 'Administrator',
    [PermissionFlagsBits.ManageGuild]: 'Manage Server',
    [PermissionFlagsBits.ManageChannels]: 'Manage Channels',
    [PermissionFlagsBits.ManageRoles]: 'Manage Roles',
    [PermissionFlagsBits.ManageMessages]: 'Manage Messages',
    [PermissionFlagsBits.KickMembers]: 'Kick Members',
    [PermissionFlagsBits.BanMembers]: 'Ban Members',
    [PermissionFlagsBits.ModerateMembers]: 'Timeout Members',
    [PermissionFlagsBits.MoveMembers]: 'Move Members'
  };
  
  return permissionNames[permission] || 'Unknown Permission';
}

export async function isOwnerOrAdmin(member) {
  return member.permissions.has(PermissionFlagsBits.Administrator);
}
