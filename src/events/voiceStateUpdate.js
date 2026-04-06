/**
 * Voice State Update Event
 * Handles voice channel joins/leaves and pings
 */

import { Events } from 'discord.js';
import { logInfo } from '../utils/logger.js';
import { createLogEmbed } from '../utils/embeds.js';

export default {
  name: Events.VoiceStateUpdate,
  async execute(oldState, newState, client) {
    try {
      const guild = newState.guild;
      const member = newState.member;

      // Find voice-chat-logs channel
      const voiceLogChannel = guild.channels.cache.find(ch => ch.name === 'voice-chat-logs');

      if (oldState.channelId !== newState.channelId) {
        let action = '';
        let channelName = '';

        if (!oldState.channelId && newState.channelId) {
          // Joined voice channel
          action = 'Joined Voice Channel';
          channelName = newState.channel.name;

          // Ping the channel if someone joins
          if (newState.channel.members.size === 1) { // First person in channel
            await newState.channel.send(`🎤 ${member} joined the voice channel!`);
          }

        } else if (oldState.channelId && !newState.channelId) {
          // Left voice channel
          action = 'Left Voice Channel';
          channelName = oldState.channel.name;

        } else if (oldState.channelId && newState.channelId) {
          // Moved between channels
          action = 'Moved Voice Channels';
          channelName = `${oldState.channel.name} → ${newState.channel.name}`;
        }

        // Log to voice-chat-logs
        if (voiceLogChannel) {
          await voiceLogChannel.send({
            embeds: [createLogEmbed(
              action,
              member.user.tag,
              `**Channel:** ${channelName}`
            )]
          });
        }

        logInfo(`${action}: ${member.user.tag} - ${channelName}`);
      }

    } catch (error) {
      console.error('Error in voiceStateUpdate event:', error);
    }
  }
};