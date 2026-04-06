/**
 * Message Reaction Add Event
 * Handles reaction roles and other reaction-based features
 */

import { Events } from 'discord.js';
import { logInfo } from '../utils/logger.js';
import { createLogEmbed } from '../utils/embeds.js';

export default {
  name: Events.MessageReactionAdd,
  async execute(reaction, user, client) {
    // Ignore bot reactions
    if (user.bot) return;

    try {
      // Handle reaction roles (placeholder - in real implementation, store role data)
      const { message } = reaction;
      const guild = message.guild;
      if (!guild) return;

      // Find server-logs
      const logChannel = guild.channels.cache.find(ch => ch.name === 'server-logs');

      // Simple reaction role handling (expand with database)
      if (message.embeds.length > 0 && message.embeds[0].title?.includes('Reaction Role')) {
        // This is a reaction role message
        const embed = message.embeds[0];
        const roleName = embed.fields?.find(f => f.name === 'Role')?.value;
        const emoji = embed.fields?.find(f => f.name === 'Emoji')?.value;

        if (roleName && reaction.emoji.name === emoji) {
          const role = guild.roles.cache.find(r => r.name === roleName);
          const member = await guild.members.fetch(user.id);

          if (role && member && !member.roles.cache.has(role.id)) {
            await member.roles.add(role);
            if (logChannel) {
              await logChannel.send({
                embeds: [createLogEmbed(
                  'Reaction Role Assigned',
                  user.tag,
                  `Role: ${roleName} via reaction`
                )]
              });
            }
          }
        }
      }

      // Handle poll reactions
      if (message.embeds.length > 0 && message.embeds[0].title?.includes('Poll')) {
        // Poll reaction added - could track votes here
        logInfo(`Poll reaction added by ${user.tag}: ${reaction.emoji.name}`);
      }

    } catch (error) {
      console.error('Error in messageReactionAdd event:', error);
    }
  }
};