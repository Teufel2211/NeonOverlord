/**
 * Validation Utility
 * Helper functions for input validation
 */

import { createErrorEmbed } from './embeds.js';

export async function validateChannelName(interaction, name) {
  if (!name || name.length < 1 || name.length > 100) {
    await interaction.reply({
      embeds: [createErrorEmbed(
        '❌ Invalid Channel Name',
        'Channel name must be between 1 and 100 characters!'
      )],
      ephemeral: true
    });
    return false;
  }
  
  // Discord allows only lowercase letters, numbers, hyphens, and underscores in channel names
  if (!/^[a-z0-9_-]+$/.test(name)) {
    await interaction.reply({
      embeds: [createErrorEmbed(
        '❌ Invalid Channel Name',
        'Channel name can only contain lowercase letters, numbers, hyphens, and underscores!'
      )],
      ephemeral: true
    });
    return false;
  }
  
  return true;
}

export async function validateRoleName(interaction, name) {
  if (!name || name.length < 1 || name.length > 100) {
    await interaction.reply({
      embeds: [createErrorEmbed(
        '❌ Invalid Role Name',
        'Role name must be between 1 and 100 characters!'
      )],
      ephemeral: true
    });
    return false;
  }
  
  return true;
}

export async function validateHexColor(interaction, color) {
  if (!/^#?[0-9A-Fa-f]{6}$/.test(color)) {
    await interaction.reply({
      embeds: [createErrorEmbed(
        '❌ Invalid Color',
        'Please provide a valid hex color (e.g., #FF0000)!'
      )],
      ephemeral: true
    });
    return false;
  }
  
  return true;
}

export function parseHexColor(color) {
  // Remove # if present and convert to integer
  const hex = color.replace('#', '');
  return parseInt(hex, 16);
}

export async function validateDuration(interaction, duration) {
  const match = duration.match(/^(\d+)([smhd])$/);
  
  if (!match) {
    await interaction.reply({
      embeds: [createErrorEmbed(
        '❌ Invalid Duration',
        'Please use format like: 10s, 5m, 2h, 1d'
      )],
      ephemeral: true
    });
    return null;
  }
  
  const value = parseInt(match[1]);
  const unit = match[2];
  
  const multipliers = {
    's': 1000,
    'm': 60 * 1000,
    'h': 60 * 60 * 1000,
    'd': 24 * 60 * 60 * 1000
  };
  
  return value * multipliers[unit];
}
