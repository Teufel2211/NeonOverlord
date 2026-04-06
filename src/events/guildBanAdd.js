/**
 * Guild Ban Add Event
 * Logs bans
 */

import { Events } from 'discord.js';
import { logInfo, logError } from '../utils/logger.js';
import { createLogEmbed } from '../utils/embeds.js';

export default {
  name: Events.GuildBanAdd,
  async execute(ban, client) {
    try {
      const guild = ban.guild;
      const user = ban.user;

      // Find server-logs channel
      let logChannel = guild.channels.cache.find(ch => ch.name === 'server-logs');

      // Log the ban
      if (logChannel) {
        const reason = ban.reason || 'No reason provided';
        await logChannel.send({
          embeds: [createLogEmbed(
            'User Banned',
            user.tag,
            `**ID:** ${user.id}\n**Reason:** ${reason}`
          )]
        });
      }

      logInfo(`User banned: ${user.tag} (${user.id})`);

    } catch (error) {
      logError('Error in guildBanAdd event:', error);
    }
  }
};
