/**
 * Help Command
 */

import { SlashCommandBuilder } from 'discord.js';
import { createInfoEmbed } from '../utils/embeds.js';

export default {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Shows all available commands'),

  async execute(interaction) {
    const helpEmbed = createInfoEmbed(
      '📚 Bot Commands Help',
      'Complete list of available commands:'
    )
    .addFields(
      {
        name: '🛠️ Channel Management',
        value: '`/channel create` `create` `delete` `rename` `slowmode`\n`/category create` `delete`',
        inline: false
      },
      {
        name: '👥 Role Management',
        value: '`/role create` `delete` `rename` `color` `assign` `remove` `adminify`',
        inline: false
      },
      {
        name: '🛡️ Moderation',
        value: '`/moderation kick` `ban` `unban` `timeout` `removetimeout`',
        inline: false
      },
      {
        name: '👤 User Management',
        value: '`/user nickname` - Change nickname\n`/voice move` - Move to voice channel',
        inline: false
      },
      {
        name: '🔗 Invite Management',
        value: '`/invite create` `delete` `track`',
        inline: false
      },
      {
        name: '⚙️ Server Settings',
        value: '`/server rename` `icon` `banner` `setafk` `setsystem` `info`',
        inline: false
      },
      {
        name: '🎯 Auto Setup',
        value: '`/setup [theme]` - Choose theme: general, roblox-rp, gta-rp, minecraft-rp, anime-rp',
        inline: false
      },
      {
        name: '📣 Community & Tickets',
        value: '`/community announcement` `/community support` `/community ticket create` `/community ticket close` `/community poll` `/community reactionrole`',
        inline: false
      }
    );

    return await interaction.reply({
      embeds: [helpEmbed],
      ephemeral: false
    });
  }
};
