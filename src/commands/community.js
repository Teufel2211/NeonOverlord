/**
 * Community Commands
 * Handles polls, reaction roles, events, etc.
 */

import { SlashCommandBuilder, PermissionFlagsBits, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { checkBotPermission, checkUserPermission } from '../utils/permissions.js';
import { createSuccessEmbed, createErrorEmbed } from '../utils/embeds.js';
import { logInfo } from '../utils/logger.js';

export default {
  data: new SlashCommandBuilder()
    .setName('community')
    .setDescription('Community interaction commands')
    .addSubcommand(subcommand =>
      subcommand
        .setName('poll')
        .setDescription('Create a poll with reactions')
        .addStringOption(option =>
          option
            .setName('question')
            .setDescription('Poll question')
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName('options')
            .setDescription('Poll options separated by commas')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('reactionrole')
        .setDescription('Create a reaction role message')
        .addStringOption(option =>
          option
            .setName('message')
            .setDescription('Message text')
            .setRequired(true)
        )
        .addRoleOption(option =>
          option
            .setName('role')
            .setDescription('Role to assign')
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName('emoji')
            .setDescription('Emoji for reaction')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('event')
        .setDescription('Post an event reminder')
        .addStringOption(option =>
          option
            .setName('title')
            .setDescription('Event title')
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName('description')
            .setDescription('Event description')
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName('time')
            .setDescription('Event time')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('meme')
        .setDescription('Post a random meme')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('quiz')
        .setDescription('Start a simple quiz')
        .addStringOption(option =>
          option
            .setName('question')
            .setDescription('Quiz question')
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName('answers')
            .setDescription('Answers separated by commas')
            .setRequired(true)
        )
        .addIntegerOption(option =>
          option
            .setName('correct')
            .setDescription('Index of correct answer (1-based)')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('announcement')
        .setDescription('Send an announcement to the announcements channel')
        .addStringOption(option =>
          option
            .setName('message')
            .setDescription('Announcement message')
            .setRequired(true)
        )
        .addBooleanOption(option =>
          option
            .setName('mention_everyone')
            .setDescription('Mention everyone?')
            .setRequired(false)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('support')
        .setDescription('Create a support request ticket')
        .addStringOption(option =>
          option
            .setName('issue')
            .setDescription('Describe the support issue')
            .setRequired(true)
        )
    )
    .addSubcommandGroup(group =>
      group
        .setName('ticket')
        .setDescription('Ticket management commands')
        .addSubcommand(subcommand =>
          subcommand
            .setName('create')
            .setDescription('Create a new support ticket channel')
            .addStringOption(option =>
              option
                .setName('issue')
                .setDescription('Describe your issue')
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand =>
          subcommand
            .setName('close')
            .setDescription('Close the current ticket channel')
        )
    ),

  async execute(interaction) {
    const commandGroup = interaction.options.getSubcommandGroup(false);
    const subcommand = interaction.options.getSubcommand();

    const protectedSubcommands = ['poll', 'reactionrole', 'event', 'announcement'];
    if (protectedSubcommands.includes(subcommand) || (commandGroup === 'ticket' && subcommand === 'close')) {
      if (!await checkUserPermission(interaction, PermissionFlagsBits.ManageMessages)) return;
    }

    if (!await checkBotPermission(interaction, PermissionFlagsBits.SendMessages)) return;

    if ((subcommand === 'support' || commandGroup === 'ticket') && !await checkBotPermission(interaction, PermissionFlagsBits.ManageChannels)) return;

    await interaction.deferReply();

    try {
      if (subcommand === 'poll') {
        const question = interaction.options.getString('question');
        const optionsStr = interaction.options.getString('options');
        const options = optionsStr.split(',').map(opt => opt.trim()).slice(0, 10); // Max 10 options

        const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

        let description = `**${question}**\n\n`;
        options.forEach((opt, index) => {
          description += `${emojis[index]} ${opt}\n`;
        });

        const pollMessage = await interaction.editReply({
          embeds: [{
            color: 0x3498DB,
            title: '📊 Poll',
            description: description,
            footer: { text: `Poll by ${interaction.user.tag}` }
          }]
        });

        // Add reactions
        for (let i = 0; i < options.length; i++) {
          await pollMessage.react(emojis[i]);
        }

      } else if (subcommand === 'reactionrole') {
        const message = interaction.options.getString('message');
        const role = interaction.options.getRole('role');
        const emoji = interaction.options.getString('emoji');

        const roleMessage = await interaction.editReply({
          embeds: [{
            color: 0x9B59B6,
            title: '🎭 Reaction Role',
            description: message,
            fields: [
              { name: 'Role', value: role.name, inline: true },
              { name: 'Emoji', value: emoji, inline: true }
            ]
          }]
        });

        await roleMessage.react(emoji);

        // Store reaction role data (in a real implementation, use a database)
        // For now, we'll handle it in the messageReactionAdd event

      } else if (subcommand === 'event') {
        const title = interaction.options.getString('title');
        const description = interaction.options.getString('description');
        const time = interaction.options.getString('time');

        const announcementsChannel = interaction.guild.channels.cache.find(ch => ch.name === 'announcements');
        if (announcementsChannel) {
          await announcementsChannel.send({
            content: '@everyone',
            embeds: [{
              color: 0xE67E22,
              title: `📅 ${title}`,
              description: description,
              fields: [
                { name: 'Time', value: time, inline: true }
              ],
              footer: { text: `Event posted by ${interaction.user.tag}` }
            }]
          });
        }

        await interaction.editReply({
          embeds: [createSuccessEmbed('Event Posted', 'Event reminder has been posted in #announcements')]
        });

      } else if (subcommand === 'meme') {
        // Placeholder for meme posting
        const memes = [
          'https://i.imgur.com/dQw4w9Wg.jpg', // Rickroll placeholder
          'https://i.imgur.com/4u4FCkJ.jpg'  // Another placeholder
        ];
        const randomMeme = memes[Math.floor(Math.random() * memes.length)];

        await interaction.editReply({
          embeds: [{
            color: 0xFF6B6B,
            title: '😂 Random Meme',
            image: { url: randomMeme }
          }]
        });

      } else if (subcommand === 'announcement') {
        const message = interaction.options.getString('message');
        const mentionEveryone = interaction.options.getBoolean('mention_everyone');
        const announcementsChannel = interaction.guild.channels.cache.find(ch => ch.name === 'announcements');

        if (!announcementsChannel) {
          return await interaction.editReply({
            embeds: [createErrorEmbed('Announcement Failed', 'Bitte erstelle zuerst einen Kanal mit dem Namen #announcements.')]
          });
        }

        await announcementsChannel.send({
          content: mentionEveryone ? '@everyone' : undefined,
          embeds: [{
            color: 0xE74C3C,
            title: '📣 Announcement',
            description: message,
            footer: { text: `Announcement by ${interaction.user.tag}` }
          }]
        });

        await interaction.editReply({
          embeds: [createSuccessEmbed('Erfolgreich angekündigt', 'Die Ankündigung wurde im Kanal #announcements veröffentlicht.')]
        });

      } else if (subcommand === 'support') {
        const issue = interaction.options.getString('issue');
        const ticketCategory = interaction.guild.channels.cache.find(ch => ch.name === 'Support Tickets' && ch.type === ChannelType.GuildCategory);
        const ownerName = interaction.user.username.toLowerCase().replace(/[^a-z0-9]/g, '');
        const ticketChannelName = `ticket-${ownerName}`;

        const existingTicket = interaction.guild.channels.cache.find(ch => ch.name === ticketChannelName);
        if (existingTicket) {
          return await interaction.editReply({
            embeds: [createErrorEmbed('Ticket besteht bereits', 'Du hast bereits ein offenes Support-Ticket.')] 
          });
        }

        const category = ticketCategory || await interaction.guild.channels.create({
          name: 'Support Tickets',
          type: ChannelType.GuildCategory
        });

        const supportRole = interaction.guild.roles.cache.find(role => role.name === 'Support Team');
        const ticketChannel = await interaction.guild.channels.create({
          name: ticketChannelName,
          type: ChannelType.GuildText,
          parent: category.id,
          permissionOverwrites: [
            {
              id: interaction.guild.roles.everyone,
              deny: [PermissionFlagsBits.ViewChannel]
            },
            {
              id: interaction.user.id,
              allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
            },
            {
              id: interaction.client.user.id,
              allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ManageChannels]
            },
            ...(supportRole ? [{
              id: supportRole.id,
              allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
            }] : [])
          ]
        });

        await ticketChannel.send({
          content: supportRole ? `<@&${supportRole.id}>` : undefined,
          embeds: [{
            color: 0x1ABC9C,
            title: '🎫 Support Ticket eröffnet',
            description: `Hallo ${interaction.user}, dein Ticket wurde erstellt. Beschreibe hier dein Problem:

${issue}`,
            footer: { text: 'Ein Support-Team wird sich schnellstmöglich darum kümmern.' }
          }]
        });

        await interaction.editReply({
          embeds: [createSuccessEmbed('Support Ticket erstellt', `Dein Ticket wurde erstellt: ${ticketChannel}`)]
        });

      } else if (commandGroup === 'ticket' && subcommand === 'create') {
        const issue = interaction.options.getString('issue');
        const ticketCategory = interaction.guild.channels.cache.find(ch => ch.name === 'Support Tickets' && ch.type === ChannelType.GuildCategory);
        const ownerName = interaction.user.username.toLowerCase().replace(/[^a-z0-9]/g, '');
        const ticketChannelName = `ticket-${ownerName}`;

        const existingTicket = interaction.guild.channels.cache.find(ch => ch.name === ticketChannelName);
        if (existingTicket) {
          return await interaction.editReply({
            embeds: [createErrorEmbed('Ticket besteht bereits', 'Du hast bereits ein offenes Ticket.')] 
          });
        }

        const category = ticketCategory || await interaction.guild.channels.create({
          name: 'Support Tickets',
          type: ChannelType.GuildCategory
        });

        const supportRole = interaction.guild.roles.cache.find(role => role.name === 'Support Team');
        const ticketChannel = await interaction.guild.channels.create({
          name: ticketChannelName,
          type: ChannelType.GuildText,
          parent: category.id,
          permissionOverwrites: [
            {
              id: interaction.guild.roles.everyone,
              deny: [PermissionFlagsBits.ViewChannel]
            },
            {
              id: interaction.user.id,
              allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
            },
            {
              id: interaction.client.user.id,
              allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ManageChannels]
            },
            ...(supportRole ? [{
              id: supportRole.id,
              allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
            }] : [])
          ]
        });

        await ticketChannel.send({
          content: supportRole ? `<@&${supportRole.id}>` : undefined,
          embeds: [{
            color: 0x1ABC9C,
            title: '🎫 Ticket eröffnet',
            description: `Ein neues Ticket wurde erstellt von ${interaction.user}.

**Thema:** ${issue}`,
            footer: { text: 'Schließe dieses Ticket mit /community ticket close.' }
          }]
        });

        await interaction.editReply({
          embeds: [createSuccessEmbed('Ticket erstellt', `Dein Ticket wurde in ${ticketChannel} erstellt.`)]
        });

      } else if (commandGroup === 'ticket' && subcommand === 'close') {
        const currentChannel = interaction.channel;

        if (!currentChannel || !currentChannel.name.startsWith('ticket-')) {
          return await interaction.editReply({
            embeds: [createErrorEmbed('Schließen fehlgeschlagen', 'Dieser Befehl kann nur in einem Ticket-Kanal verwendet werden.')]
          });
        }

        await currentChannel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
          ViewChannel: false,
          SendMessages: false
        });

        await currentChannel.edit({
          name: `${currentChannel.name}-geschlossen`
        });

        await currentChannel.send({
          embeds: [createSuccessEmbed('Ticket geschlossen', 'Dieses Ticket wurde geschlossen.')] 
        });

        await interaction.editReply({
          embeds: [createSuccessEmbed('Ticket geschlossen', 'Das Ticket wurde erfolgreich beendet.')] 
        });

      } else if (subcommand === 'quiz') {
        const question = interaction.options.getString('question');
        const answersStr = interaction.options.getString('answers');
        const correctIndex = interaction.options.getInteger('correct') - 1; // 0-based
        const answers = answersStr.split(',').map(ans => ans.trim());

        const quizMessage = await interaction.editReply({
          embeds: [{
            color: 0xF1C40F,
            title: '🧠 Quiz Time!',
            description: `**${question}**\n\n${answers.map((ans, i) => `${i + 1}. ${ans}`).join('\n')}`,
            footer: { text: 'Reply with the number of your answer!' }
          }]
        });

        // In a real implementation, collect responses and check answers
      }

    } catch (error) {
      console.error('Community command error:', error);
      return await interaction.editReply({
        embeds: [createErrorEmbed('Command Failed', 'An error occurred!')]
      });
    }
  }
};