/**
 * Guild Member Remove Event
 * Logs member leaves
 */

import { Events } from 'discord.js';
import { logInfo, logError } from '../utils/logger.js';
import { createLogEmbed } from '../utils/embeds.js';

export default {
  name: Events.GuildMemberRemove,
  async execute(member, client) {
    try {
      const guild = member.guild;

      // Find server-logs channel
      let logChannel = guild.channels.cache.find(ch => ch.name === 'server-logs');

      // Log the leave
      if (logChannel) {
        await logChannel.send({
          embeds: [createLogEmbed(
            'Member Left',
            member.user.tag,
            `**ID:** ${member.id}\n**Joined:** ${member.joinedAt.toLocaleDateString()}`
          )]
        });
      }

      logInfo(`Member left: ${member.user.tag} (${member.id})`);

    } catch (error) {
      logError('Error in guildMemberRemove event:', error);
    }
  }
};
