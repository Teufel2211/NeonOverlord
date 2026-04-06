/**
 * Slash Command Deployer
 * Deploys all slash commands to Discord
 */

import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import { readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { logInfo, logSuccess, logError } from './utils/logger.js';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

if (!TOKEN || !CLIENT_ID) {
  logError('Missing DISCORD_TOKEN or CLIENT_ID in .env file');
  process.exit(1);
}

const commands = [];

async function loadCommands() {
  const commandsPath = join(__dirname, 'commands');
  const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = join(commandsPath, file);
    try {
      const command = await import(`file://${filePath}`);
      const commandModule = command.default || command;

      if (commandModule.data) {
        commands.push(commandModule.data.toJSON());
        logInfo(`Loaded command: ${commandModule.data.name}`);
      }
    } catch (error) {
      logError(`Error loading command ${file}:`, error);
    }
  }
}

async function deployCommands() {
  try {
    logInfo(`Started refreshing ${commands.length} application (/) commands.`);

    const rest = new REST({ version: '10' }).setToken(TOKEN);

    let data;

    if (GUILD_ID) {
      // Deploy to specific guild (faster for testing)
      logInfo(`Deploying commands to guild: ${GUILD_ID}`);
      data = await rest.put(
        Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
        { body: commands }
      );
    } else {
      // Deploy globally (can take up to 1 hour to propagate)
      logInfo('Deploying commands globally (this may take up to 1 hour to propagate)');
      data = await rest.put(
        Routes.applicationCommands(CLIENT_ID),
        { body: commands }
      );
    }

    logSuccess(`✅ Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    logError('Error deploying commands:', error);
  }
}

async function main() {
  await loadCommands();
  await deployCommands();
}

main();
