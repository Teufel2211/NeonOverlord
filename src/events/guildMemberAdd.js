/**
 * Guild Member Add Event
 * Logs joins and handles first-join special invite logic
 */

import { Events } from 'discord.js';
import { logInfo, logError } from '../utils/logger.js';
import { recordInviteUse, getServerFirstJoinInfo } from '../utils/inviteManager.js';
import { createLogEmbed } from '../utils/embeds.js';

export default {
  name: Events.GuildMemberAdd,
  async execute(member, client) {
    try {
      const guild = member.guild;
      
      // Find server-logs channel
      let logChannel = guild.channels.cache.find(ch => ch.name === 'server-logs');

      // Log the join
      if (logChannel) {
        await logChannel.send({
          embeds: [createLogEmbed(
            'Member Joined',
            member.user.tag,
            `**ID:** ${member.id}\n**Account Created:** ${member.user.createdAt.toLocaleDateString()}`
          )]
        });
      }

      logInfo(`Member joined: ${member.user.tag} (${member.id})`);

      // Check if this is the first member using the special invite
      const firstJoinInfo = getServerFirstJoinInfo(guild.id);
      if (firstJoinInfo && !firstJoinInfo.usedBy) {
        // Get current invites to find which one was used
        const invites = await guild.invites.fetch();
        const specialInvite = invites.find(inv => inv.code === firstJoinInfo.code);

        if (specialInvite && specialInvite.uses > 0 && !firstJoinInfo.usedBy) {
          // This is the first use of the special invite
          const ownerRole = guild.roles.cache.get(firstJoinInfo.roleToGive);
          
          if (ownerRole) {
            await member.roles.add(ownerRole);
            
            if (logChannel) {
              await logChannel.send({
                embeds: [{
                  color: 0xFF0000,
                  title: '👑 First Join - Owner Role Assigned',
                  description: `${member} has been granted the **Owner** role!`,
                  fields: [
                    { name: 'User', value: member.user.tag, inline: true },
                    { name: 'Role', value: 'Owner', inline: true }
                  ],
                  timestamp: new Date()
                }]
              });
            }

            // Update the first join info
            firstJoinInfo.usedBy = {
              userId: member.id,
              joinedAt: new Date()
            };

            // Community activation message
            const welcomeChannel = guild.channels.cache.find(ch => ch.name === 'welcome');
            if (welcomeChannel) {
              await welcomeChannel.send({
                content: `@everyone Hey everyone, our first member is here! 🎉 Welcome ${member}!`,
                embeds: [{
                  color: 0x00FF00,
                  title: '🚀 Community Activated!',
                  description: 'The server is now active with its first member!',
                  fields: [
                    { name: 'First Member', value: member.user.tag, inline: true },
                    { name: 'Role Granted', value: 'Owner', inline: true }
                  ]
                }]
              });
            }
          }
        }
      }

      // Try to send welcome DM
      try {
        const dmEmbed = {
          color: 0x9C27B0,
          title: '👋 Welcome to the Server!',
          description: `Welcome to **${guild.name}**! We're excited to have you here. Please read the rules and enjoy your stay!`,
          fields: [
            { name: 'Members', value: `${guild.memberCount}`, inline: true },
            { name: 'Channels', value: `${guild.channels.cache.size}`, inline: true }
          ],
          thumbnail: { url: guild.iconURL({ dynamic: true }) },
          timestamp: new Date()
        };

        await member.send({ embeds: [dmEmbed] });
      } catch (error) {
        logError(`Could not send welcome DM to ${member.user.tag}`, error);
      }

    } catch (error) {
      logError('Error in guildMemberAdd event:', error);
    }
  }
};
