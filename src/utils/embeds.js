/**
 * Embed Utility
 * Helper functions for creating Discord embeds
 */

import { EmbedBuilder } from 'discord.js';

export function createSuccessEmbed(title, description) {
  return new EmbedBuilder()
    .setColor('#00FF00')
    .setTitle(title)
    .setDescription(description)
    .setTimestamp();
}

export function createErrorEmbed(title, description) {
  return new EmbedBuilder()
    .setColor('#FF0000')
    .setTitle(title)
    .setDescription(description)
    .setTimestamp();
}

export function createInfoEmbed(title, description) {
  return new EmbedBuilder()
    .setColor('#0099FF')
    .setTitle(title)
    .setDescription(description)
    .setTimestamp();
}

export function createWarningEmbed(title, description) {
  return new EmbedBuilder()
    .setColor('#FFFF00')
    .setTitle(title)
    .setDescription(description)
    .setTimestamp();
}

export function createLogEmbed(action, user, details) {
  const embed = new EmbedBuilder()
    .setColor('#000099')
    .setTitle(`📋 ${action}`)
    .setDescription(`**User:** ${user}\n${details}`)
    .setTimestamp()
    .setFooter({ text: 'Bot Logging System' });
  
  return embed;
}

export function createSetupEmbed() {
  return new EmbedBuilder()
    .setColor('#9C27B0')
    .setTitle('🎉 Server Setup Complete!')
    .setDescription('Your server has been configured with the following:')
    .addFields(
      { name: '📁 Channels', value: '#welcome, #rules, #general, #announcements', inline: false },
      { name: '👤 Roles', value: 'Owner role created with admin permissions', inline: false },
      { name: '🔗 Special Features', value: 'Invite tracking and logging system enabled', inline: false }
    )
    .setTimestamp();
}
