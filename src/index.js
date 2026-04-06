/**
 * Main Bot Index
 * Initializes the Discord bot and loads all commands and events
 */

import { Client, Collection, GatewayIntentBits, Events } from 'discord.js';
import { config } from 'dotenv';
import { readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { logInfo, logError, logSuccess, logWarn } from './utils/logger.js';

// Load environment variables
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

// Create Discord client with necessary intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Collection for commands
client.commands = new Collection();

// Load commands
async function loadCommands() {
  const commandsPath = join(__dirname, 'commands');
  const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  
  for (const file of commandFiles) {
    const filePath = join(commandsPath, file);
    try {
      const command = await import(`file://${filePath}`);
      const commandModule = command.default || command;
      
      if (commandModule.data && commandModule.execute) {
        client.commands.set(commandModule.data.name, commandModule);
        logSuccess(`Command loaded: ${commandModule.data.name}`);
      }
    } catch (error) {
      logError(`Error loading command ${file}:`, error);
    }
  }
}

// Load events
async function loadEvents() {
  const eventsPath = join(__dirname, 'events');
  const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith('.js'));
  
  for (const file of eventFiles) {
    const filePath = join(eventsPath, file);
    try {
      const event = await import(`file://${filePath}`);
      const eventModule = event.default || event;
      
      if (eventModule.name && eventModule.execute) {
        if (eventModule.once) {
          client.once(eventModule.name, (...args) => eventModule.execute(...args, client));
        } else {
          client.on(eventModule.name, (...args) => eventModule.execute(...args, client));
        }
        logSuccess(`Event loaded: ${eventModule.name}`);
      }
    } catch (error) {
      logError(`Error loading event ${file}:`, error);
    }
  }
}

// Initialize bot
async function initialize() {
  try {
    logInfo('🤖 Bot is starting up...');
    await loadCommands();
    await loadEvents();
    
    await client.login(process.env.DISCORD_TOKEN);
  } catch (error) {
    logError('Failed to initialize bot:', error);
    process.exit(1);
  }
}

// Error handling
client.on('error', error => {
  logError('Discord client error:', error);
});

process.on('unhandledRejection', error => {
  logError('Unhandled promise rejection:', error);
});

process.on('uncaughtException', error => {
  logError('Uncaught exception:', error);
});

// Start the bot
initialize();

export default client;
