/**
 * Message Create Event
 * Handles auto-moderation and message processing
 */

import { Events } from 'discord.js';
import { logInfo, logWarn } from '../utils/logger.js';
import { createLogEmbed } from '../utils/embeds.js';

export default {
  name: Events.MessageCreate,
  async execute(message, client) {
    // Ignore bot messages
    if (message.author.bot) return;

    try {
      const guild = message.guild;
      if (!guild) return;

      // Find server-logs channel
      const logChannel = guild.channels.cache.find(ch => ch.name === 'server-logs');

      // Auto-moderation: Spam detection (simple implementation)
      const spamPatterns = [
        /(.)\1{10,}/, // Repeated characters
        /\b(?:https?:\/\/)?(?:www\.)?(?:discord\.gg|discordapp\.com\/invite)\/\w+/gi, // Discord invites
        /\b(?:https?:\/\/)?(?:www\.)?(?:bit\.ly|tinyurl\.com|goo\.gl)\/\w+/gi // Shortened URLs
      ];

      for (const pattern of spamPatterns) {
        if (pattern.test(message.content)) {
          // Delete the message
          await message.delete();

          // Warn the user
          try {
            await message.author.send({
              content: `⚠️ Your message in **${guild.name}** was deleted for containing spam or prohibited content.`
            });
          } catch (error) {
            // User has DMs disabled
          }

          // Log the action
          if (logChannel) {
            await logChannel.send({
              embeds: [createLogEmbed(
                'Auto-Mod: Spam Detected',
                message.author.tag,
                `**Message:** ${message.content.substring(0, 100)}...\n**Channel:** ${message.channel.name}`
              )]
            });
          }

          logWarn(`Spam detected from ${message.author.tag}: ${message.content}`);
          return;
        }
      }

      // Activity tracking for roles (simple implementation)
      // This could be expanded with a database for persistent tracking
      const activeMemberRole = guild.roles.cache.find(r => r.name === 'Active Member');
      if (activeMemberRole && message.content.length > 10) {
        // Simple activity check: messages longer than 10 chars
        const member = message.member;
        if (member && !member.roles.cache.has(activeMemberRole.id)) {
          // Check if user has been active (this is a placeholder, in real implementation use database)
          await member.roles.add(activeMemberRole);
          if (logChannel) {
            await logChannel.send({
              embeds: [createLogEmbed(
                'Role Assigned: Active Member',
                message.author.tag,
                'User became active and received Active Member role'
              )]
            });
          }
        }
      }

    } catch (error) {
      console.error('Error in messageCreate event:', error);
    }
  }
};