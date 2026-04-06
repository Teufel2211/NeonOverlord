/**
 * Community Commands
 * Handles polls, reaction roles, events, etc.
 */

import { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
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
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (!await checkUserPermission(interaction, PermissionFlagsBits.ManageMessages)) return;
    if (!await checkBotPermission(interaction, PermissionFlagsBits.SendMessages)) return;

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