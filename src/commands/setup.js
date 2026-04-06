/**
 * Setup Command - Complete Server Auto-Setup System
 */

import { SlashCommandBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { checkBotPermission, checkUserPermission } from '../utils/permissions.js';
import { createSuccessEmbed, createErrorEmbed, createSetupEmbed } from '../utils/embeds.js';
import {
  trackInvite,
  setServerFirstJoinInfo,
  getServerFirstJoinInfo
} from '../utils/inviteManager.js';
import { logInfo } from '../utils/logger.js';

// Theme configurations
const themes = {
  general: {
    serverName: 'NeonOverlord Server',
    categories: ['SERVER-HUB', 'COMMUNITY', 'GAMING'],
    textChannels: [
      { name: 'welcome', category: 'SERVER-HUB', topic: 'Welcome to our server!' },
      { name: 'rules', category: 'SERVER-HUB', topic: 'Server rules and guidelines' },
      { name: 'announcements', category: 'SERVER-HUB', topic: 'Important announcements' },
      { name: 'general', category: 'COMMUNITY', topic: 'General discussion' },
      { name: 'bot-commands', category: 'COMMUNITY', topic: 'Bot commands and interactions' },
      { name: 'memes', category: 'COMMUNITY', topic: 'Funny memes and entertainment' },
      { name: 'voice-chat-logs', category: 'COMMUNITY', topic: 'Voice channel activity logs' }
    ],
    voiceChannels: [
      { name: '🔊 General', category: 'GAMING' },
      { name: '🎶 Music', category: 'GAMING' },
      { name: '🎮 Gaming', category: 'GAMING' },
      { name: '💬 Chill', category: 'GAMING' }
    ],
    roles: [
      { name: 'Owner', color: '#FF0000', permissions: [PermissionFlagsBits.Administrator] },
      { name: 'Moderator', color: '#FFA500', permissions: [PermissionFlagsBits.KickMembers, PermissionFlagsBits.BanMembers, PermissionFlagsBits.ManageMessages] },
      { name: 'Member', color: '#00FF00', permissions: [PermissionFlagsBits.SendMessages] },
      { name: 'Bot', color: '#0099FF', permissions: [PermissionFlagsBits.SendMessages] }
    ],
    emojis: ['smile', 'thumbsup', 'fire'],
    welcomeMessage: 'Welcome to our awesome server! 🎉',
    communityActivation: 'Hey @everyone, our server is now ready for an amazing community experience!'
  },
  'roblox-rp': {
    serverName: 'Roblox RP Universe',
    categories: ['RP-HUB', 'ROLEPLAY', 'OOC'],
    textChannels: [
      { name: 'welcome', category: 'RP-HUB', topic: 'Welcome to Roblox RP!' },
      { name: 'rules', category: 'RP-HUB', topic: 'RP rules and guidelines' },
      { name: 'announcements', category: 'RP-HUB', topic: 'Important RP announcements' },
      { name: 'general-rp', category: 'ROLEPLAY', topic: 'General roleplay discussion' },
      { name: 'character-sheets', category: 'ROLEPLAY', topic: 'Post your character sheets here' },
      { name: 'storytelling', category: 'ROLEPLAY', topic: 'RP story threads' },
      { name: 'out-of-character', category: 'OOC', topic: 'OOC chat - keep RP separate' },
      { name: 'memes', category: 'OOC', topic: 'Roblox memes and fun' }
    ],
    voiceChannels: [
      { name: '🎭 RP Voice 1', category: 'ROLEPLAY' },
      { name: '🎭 RP Voice 2', category: 'ROLEPLAY' },
      { name: '🎵 Music RP', category: 'OOC' },
      { name: '💬 OOC Chat', category: 'OOC' }
    ],
    roles: [
      { name: 'Game Master', color: '#FF0000', permissions: [PermissionFlagsBits.Administrator] },
      { name: 'Moderator', color: '#FFA500', permissions: [PermissionFlagsBits.KickMembers, PermissionFlagsBits.ManageMessages] },
      { name: 'Roleplayer', color: '#00FF00', permissions: [PermissionFlagsBits.SendMessages] },
      { name: 'Newbie', color: '#FFFF00', permissions: [PermissionFlagsBits.SendMessages] },
      { name: 'Bot', color: '#0099FF', permissions: [PermissionFlagsBits.SendMessages] }
    ],
    emojis: ['roblox', 'game', 'roleplay'],
    welcomeMessage: 'Welcome to Roblox RP Universe! Create your character and start roleplaying! 🎮',
    communityActivation: '@everyone Welcome to Roblox RP! Let\'s build an amazing roleplay community together! 🚀'
  },
  'gta-rp': {
    serverName: 'GTA RP City',
    categories: ['RP-HUB', 'CITY-RP', 'OOC'],
    textChannels: [
      { name: 'welcome', category: 'RP-HUB', topic: 'Welcome to GTA RP City!' },
      { name: 'rules', category: 'RP-HUB', topic: 'RP rules and guidelines' },
      { name: 'announcements', category: 'RP-HUB', topic: 'Important RP announcements' },
      { name: 'general-rp', category: 'CITY-RP', topic: 'General roleplay discussion' },
      { name: 'character-apps', category: 'CITY-RP', topic: 'Character applications' },
      { name: 'crime-rp', category: 'CITY-RP', topic: 'Crime and action RP' },
      { name: 'business-rp', category: 'CITY-RP', topic: 'Business and economy RP' },
      { name: 'out-of-character', category: 'OOC', topic: 'OOC chat - keep RP separate' },
      { name: 'memes', category: 'OOC', topic: 'GTA memes and fun' }
    ],
    voiceChannels: [
      { name: '🚔 Police Radio', category: 'CITY-RP' },
      { name: '🚑 EMS Radio', category: 'CITY-RP' },
      { name: '💰 Business Calls', category: 'CITY-RP' },
      { name: '🎵 Music RP', category: 'OOC' },
      { name: '💬 OOC Chat', category: 'OOC' }
    ],
    roles: [
      { name: 'Mayor', color: '#FF0000', permissions: [PermissionFlagsBits.Administrator] },
      { name: 'Police Chief', color: '#0000FF', permissions: [PermissionFlagsBits.KickMembers, PermissionFlagsBits.ManageMessages] },
      { name: 'Citizen', color: '#00FF00', permissions: [PermissionFlagsBits.SendMessages] },
      { name: 'Criminal', color: '#FF0000', permissions: [PermissionFlagsBits.SendMessages] },
      { name: 'Business Owner', color: '#FFFF00', permissions: [PermissionFlagsBits.SendMessages] },
      { name: 'Bot', color: '#0099FF', permissions: [PermissionFlagsBits.SendMessages] }
    ],
    emojis: ['car', 'police', 'money'],
    welcomeMessage: 'Welcome to GTA RP City! Choose your path: Law, Crime, or Business! 🚗',
    communityActivation: '@everyone GTA RP City is now open! Start your criminal empire or protect the streets! 🏙️'
  },
  'minecraft-rp': {
    serverName: 'Minecraft RP Realm',
    categories: ['RP-HUB', 'REALM-RP', 'OOC'],
    textChannels: [
      { name: 'welcome', category: 'RP-HUB', topic: 'Welcome to Minecraft RP Realm!' },
      { name: 'rules', category: 'RP-HUB', topic: 'RP rules and guidelines' },
      { name: 'announcements', category: 'RP-HUB', topic: 'Important RP announcements' },
      { name: 'general-rp', category: 'REALM-RP', topic: 'General roleplay discussion' },
      { name: 'character-sheets', category: 'REALM-RP', topic: 'Post your character sheets here' },
      { name: 'trading-post', category: 'REALM-RP', topic: 'Trade items and resources' },
      { name: 'out-of-character', category: 'OOC', topic: 'OOC chat - keep RP separate' },
      { name: 'memes', category: 'OOC', topic: 'Minecraft memes and fun' }
    ],
    voiceChannels: [
      { name: '🏰 Castle Council', category: 'REALM-RP' },
      { name: '🏘️ Village Meeting', category: 'REALM-RP' },
      { name: '⛏️ Mining Party', category: 'REALM-RP' },
      { name: '🎵 Music RP', category: 'OOC' },
      { name: '💬 OOC Chat', category: 'OOC' }
    ],
    roles: [
      { name: 'King', color: '#FFD700', permissions: [PermissionFlagsBits.Administrator] },
      { name: 'Guard Captain', color: '#C0C0C0', permissions: [PermissionFlagsBits.KickMembers, PermissionFlagsBits.ManageMessages] },
      { name: 'Villager', color: '#00FF00', permissions: [PermissionFlagsBits.SendMessages] },
      { name: 'Merchant', color: '#FFFF00', permissions: [PermissionFlagsBits.SendMessages] },
      { name: 'Adventurer', color: '#FF4500', permissions: [PermissionFlagsBits.SendMessages] },
      { name: 'Bot', color: '#0099FF', permissions: [PermissionFlagsBits.SendMessages] }
    ],
    emojis: ['pickaxe', 'sword', 'diamond'],
    welcomeMessage: 'Welcome to Minecraft RP Realm! Build your story in our blocky world! ⛏️',
    communityActivation: '@everyone The Minecraft RP Realm is ready! Start building your legend! 🏰'
  },
  'anime-rp': {
    serverName: 'Anime RP World',
    categories: ['RP-HUB', 'ANIME-RP', 'OOC'],
    textChannels: [
      { name: 'welcome', category: 'RP-HUB', topic: 'Welcome to Anime RP World!' },
      { name: 'rules', category: 'RP-HUB', topic: 'RP rules and guidelines' },
      { name: 'announcements', category: 'RP-HUB', topic: 'Important RP announcements' },
      { name: 'general-rp', category: 'ANIME-RP', topic: 'General roleplay discussion' },
      { name: 'character-sheets', category: 'ANIME-RP', topic: 'Post your character sheets here' },
      { name: 'ship-discussion', category: 'ANIME-RP', topic: 'Discuss ships and relationships' },
      { name: 'out-of-character', category: 'OOC', topic: 'OOC chat - keep RP separate' },
      { name: 'memes', category: 'OOC', topic: 'Anime memes and fun' }
    ],
    voiceChannels: [
      { name: '🎎 RP Voice 1', category: 'ANIME-RP' },
      { name: '🎎 RP Voice 2', category: 'ANIME-RP' },
      { name: '🎵 Anime Music', category: 'OOC' },
      { name: '💬 OOC Chat', category: 'OOC' }
    ],
    roles: [
      { name: 'Sensei', color: '#FF0000', permissions: [PermissionFlagsBits.Administrator] },
      { name: 'Moderator', color: '#FFA500', permissions: [PermissionFlagsBits.KickMembers, PermissionFlagsBits.ManageMessages] },
      { name: 'Student', color: '#00FF00', permissions: [PermissionFlagsBits.SendMessages] },
      { name: 'Ninja', color: '#000000', permissions: [PermissionFlagsBits.SendMessages] },
      { name: 'Mage', color: '#800080', permissions: [PermissionFlagsBits.SendMessages] },
      { name: 'Bot', color: '#0099FF', permissions: [PermissionFlagsBits.SendMessages] }
    ],
    emojis: ['ninja', 'magic', 'sword'],
    welcomeMessage: 'Welcome to Anime RP World! Choose your path and start your adventure! 🎌',
    communityActivation: '@everyone Anime RP World is open! Let the adventures begin! 🌸'
  }
};

export default {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Automatic server setup system with themes')
    .addSubcommand(subcommand =>
      subcommand
        .setName('general')
        .setDescription('General community server setup')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('roblox-rp')
        .setDescription('Roblox Roleplay server setup')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('gta-rp')
        .setDescription('GTA Roleplay server setup')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('minecraft-rp')
        .setDescription('Minecraft Roleplay server setup')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('anime-rp')
        .setDescription('Anime Roleplay server setup')
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (!await checkUserPermission(interaction, PermissionFlagsBits.ManageGuild)) return;
    if (!await checkBotPermission(interaction, PermissionFlagsBits.All)) return;

    await interaction.deferReply();

    try {
      const theme = themes[subcommand];
      if (!theme) {
        return await interaction.editReply({
          embeds: [createErrorEmbed('❌ Invalid Theme', 'This theme is not available.')]
        });
      }

      await this.performSetup(interaction, theme, subcommand);

    } catch (error) {
      console.error('Setup command error:', error);
      return await interaction.editReply({
        embeds: [createErrorEmbed('❌ Setup Failed', 'An error occurred during server setup!')]
      });
    }
  },

  async performSetup(interaction, theme, themeName) {
    let createdItems = {
      categories: [],
      channels: [],
      roles: []
    };

    // Step 1: Update server settings
    await interaction.guild.setName(theme.serverName);

    // Step 2: Create categories
    const categoryMap = {};
    for (const catName of theme.categories) {
      const category = await interaction.guild.channels.create({
        name: catName,
        type: ChannelType.GuildCategory,
        reason: `Auto setup by ${themeName} theme`
      });
      categoryMap[catName] = category;
      createdItems.categories.push(catName);
    }

    // Step 3: Create text channels
    const channelMap = {};
    for (const ch of theme.textChannels) {
      const category = categoryMap[ch.category];
      if (!category) continue;

      const channel = await interaction.guild.channels.create({
        name: ch.name,
        type: ChannelType.GuildText,
        parent: category.id,
        topic: ch.topic,
        reason: `Auto setup by ${themeName} theme`
      });
      channelMap[ch.name] = channel;
      createdItems.channels.push(ch.name);
    }

    // Step 4: Create voice channels
    for (const ch of theme.voiceChannels) {
      const category = categoryMap[ch.category];
      if (!category) continue;

      const channel = await interaction.guild.channels.create({
        name: ch.name,
        type: ChannelType.GuildVoice,
        parent: category.id,
        reason: `Auto setup by ${themeName} theme`
      });
      channelMap[ch.name] = channel;
      createdItems.channels.push(ch.name);
    }

    // Step 5: Create LOGGING category and server-logs
    const logsCategory = await interaction.guild.channels.create({
      name: 'LOGGING',
      type: ChannelType.GuildCategory,
      reason: `Auto setup by ${themeName} theme`
    });

    const serverLogs = await interaction.guild.channels.create({
      name: 'server-logs',
      type: ChannelType.GuildText,
      parent: logsCategory.id,
      topic: 'Server events and moderation logs',
      reason: `Auto setup by ${themeName} theme`
    });
    createdItems.channels.push('server-logs');

    // Step 6: Create roles
    const roleMap = {};
    for (const roleData of theme.roles) {
      const role = await interaction.guild.roles.create({
        name: roleData.name,
        color: roleData.color,
        permissions: roleData.permissions,
        reason: `Auto setup by ${themeName} theme`
      });
      roleMap[roleData.name] = role;
      createdItems.roles.push(roleData.name);
    }

    // Assign Bot role to the bot
    const botRole = roleMap['Bot'];
    if (botRole) {
      const botMember = interaction.guild.members.cache.get(interaction.client.user.id);
      if (botMember) {
        await botMember.roles.add(botRole);
      }
    }

    // Step 7: Set AFK channel (use first voice channel)
    const firstVoiceChannel = Object.values(channelMap).find(ch => ch.type === ChannelType.GuildVoice);
    if (firstVoiceChannel) {
      await interaction.guild.setAFKChannel(firstVoiceChannel);
    }

    // Set system channel to welcome
    const welcomeChannel = channelMap['welcome'];
    if (welcomeChannel) {
      await interaction.guild.setSystemChannel(welcomeChannel);
    }

    // Step 8: Create first-join invite
    const firstJoinInvite = await welcomeChannel.createInvite({
      maxUses: 1,
      maxAge: 0,
      reason: 'First join special invite'
    });

    // Track this special invite
    trackInvite(interaction.guildId, firstJoinInvite.code, interaction.user.id);
    setServerFirstJoinInfo(interaction.guildId, {
      code: firstJoinInvite.code,
      createdBy: interaction.user.id,
      createdAt: new Date(),
      usedBy: null,
      roleToGive: roleMap[theme.roles[0].name].id, // First role (usually owner/admin)
      channel: welcomeChannel.id
    });

    logInfo(`${themeName} server setup completed for ${interaction.guild.name}`);

    // Step 9: Send the setup confirmation embed
    await interaction.editReply({
      embeds: [createSetupEmbed(themeName)]
    });

    // Step 10: Send the special invite to user DM
    try {
      const dmChannel = await interaction.user.createDM();
      await dmChannel.send({
        content: `🎉 **${theme.serverName} Setup Complete!**\n\nHere's your special first-join invite link (max 1 use):\n\n**https://discord.gg/${firstJoinInvite.code}**\n\nThe first person to join using this link will receive the **${theme.roles[0].name}** role automatically!\n\n*This invite expires after the first use.*`,
        embeds: [createSetupEmbed(themeName)]
      });
    } catch (error) {
      await serverLogs.send({
        content: `⚠️ Could not send DM to ${interaction.user.tag} with first-join invite: ${firstJoinInvite.code}`
      });
    }

    // Step 11: Community Activation - Send welcome message and activation message
    if (welcomeChannel) {
      await welcomeChannel.send({
        embeds: [{
          color: 0x9C27B0,
          title: '👋 Welcome to the Server!',
          description: theme.welcomeMessage,
          fields: [
            { name: '#welcome', value: 'Introduction channel', inline: true },
            { name: '#rules', value: 'Rules and guidelines', inline: true },
            { name: '#general', value: 'General discussion', inline: true }
          ]
        }]
      });

      // Immediate community activation
      await welcomeChannel.send({
        content: theme.communityActivation,
        embeds: [{
          color: 0x00FF00,
          title: '🚀 Community Activated!',
          description: `The ${theme.serverName} is now live and ready for your community!`,
          fields: [
            { name: 'Theme', value: themeName, inline: true },
            { name: 'Channels Created', value: createdItems.channels.length.toString(), inline: true },
            { name: 'Roles Created', value: createdItems.roles.length.toString(), inline: true }
          ],
          timestamp: new Date()
        }]
      });
    }

    // Step 12: Start community events (post memes, start polls, etc.)
    await this.activateCommunity(interaction, theme, channelMap, themeName);

    await serverLogs.send({
      embeds: [{
        color: 0x00FF00,
        title: '✅ Server Setup Completed',
        description: `${themeName} setup completed by ${interaction.user.tag}`,
        fields: [
          { name: 'Channels Created', value: createdItems.channels.join(', '), inline: false },
          { name: 'Roles Created', value: createdItems.roles.join(', '), inline: false },
          { name: 'Special Invite', value: `https://discord.gg/${firstJoinInvite.code}`, inline: false }
        ],
        timestamp: new Date()
      }]
    });

    return;
  },

  async activateCommunity(interaction, theme, channelMap, themeName) {
    // Post initial memes in memes channel
    const memesChannel = channelMap['memes'];
    if (memesChannel) {
      const initialMemes = [
        'https://i.imgur.com/dQw4w9Wg.jpg', // Rickroll placeholder
        'https://i.imgur.com/4u4FCkJ.jpg'  // Another placeholder
      ];
      for (const meme of initialMemes) {
        await memesChannel.send({
          embeds: [{
            color: 0xFF6B6B,
            title: '😂 Community Meme',
            image: { url: meme },
            footer: { text: `Posted by ${interaction.client.user.username}` }
          }]
        });
      }
    }

    // Start a welcome poll in general channel
    const generalChannel = channelMap['general'] || channelMap['general-rp'];
    if (generalChannel) {
      const pollMessage = await generalChannel.send({
        embeds: [{
          color: 0x3498DB,
          title: '📊 Welcome Poll',
          description: `**What brings you to ${theme.serverName}?**\n\n1️⃣ Roleplaying\n2️⃣ Making friends\n3️⃣ Having fun\n4️⃣ Other`,
          footer: { text: `Poll started by ${interaction.client.user.username}` }
        }]
      });

      // Add reactions
      await pollMessage.react('1️⃣');
      await pollMessage.react('2️⃣');
      await pollMessage.react('3️⃣');
      await pollMessage.react('4️⃣');
    }

    // Post rules in rules channel
    const rulesChannel = channelMap['rules'];
    if (rulesChannel) {
      await rulesChannel.send({
        embeds: [{
          color: 0xE74C3C,
          title: '📋 Server Rules',
          description: `**Welcome to ${theme.serverName}!**\n\n1. Be respectful to all members\n2. No spam or excessive caps\n3. Keep content appropriate\n4. Follow Discord TOS\n5. Have fun and enjoy the community!\n\n*Violations may result in warnings, timeouts, or bans.*`,
          footer: { text: `Rules posted by ${interaction.client.user.username}` }
        }]
      });
    }
  }
};
