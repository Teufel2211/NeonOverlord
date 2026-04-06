/**
 * Guild Ban Remove Event
 * Logs unbans
 */

import { Events } from 'discord.js';
import { logInfo, logError } from '../utils/logger.js';
import { createLogEmbed } from '../utils/embeds.js';

export default {
  name: Events.GuildBanRemove,
  async execute(ban, client) {
    try {
      const guild = ban.guild;
      const user = ban.user;

      // Find server-logs channel
      let logChannel = guild.channels.cache.find(ch => ch.name === 'server-logs');

      // Log the unban
      if (logChannel) {
        const reason = ban.reason || 'No reason provided';
        await logChannel.send({
          embeds: [createLogEmbed(
            'User Unbanned',
            user.tag,
            `**ID:** ${user.id}\n**Reason:** ${reason}`
          )]
        });
      }

      logInfo(`User unbanned: ${user.tag} (${user.id})`);

    } catch (error) {
      logError('Error in guildBanRemove event:', error);
    }
  }
};
