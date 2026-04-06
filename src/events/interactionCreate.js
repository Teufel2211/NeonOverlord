/**
 * Interaction Create Event
 * Handles slash commands
 */

import { Events } from 'discord.js';
import { logError, logInfo, logWarn } from '../utils/logger.js';

export default {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    // Handle slash commands
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
      logWarn(`Unknown command: ${interaction.commandName}`);
      return await interaction.reply({
        content: '❌ Unknown command!',
        ephemeral: true
      });
    }

    try {
      logInfo(`Command executed: ${interaction.commandName} by ${interaction.user.tag}`);
      await command.execute(interaction);
    } catch (error) {
      logError(`Error executing command ${interaction.commandName}:`, error);

      const errorMessage = {
        content: '❌ An error occurred while executing this command!',
        ephemeral: true
      };

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(errorMessage);
      } else {
        await interaction.reply(errorMessage);
      }
    }
  }
};
