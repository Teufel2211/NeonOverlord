/**
 * Ready Event
 */

import { Events } from 'discord.js';
import { logSuccess, logInfo } from '../utils/logger.js';

export default {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    logSuccess(`✅ Bot is logged in as ${client.user.tag}`);
    logInfo(`Bot is serving ${client.guilds.cache.size} server(s)`);
    
    // Set bot status
    client.user.setPresence({
      activities: [{
        name: 'Server Management',
        type: 0 // 0 = Playing, 1 = Streaming, 2 = Listening, 3 = Watching
      }],
      status: 'online'
    });
    
    logInfo('Bot status set to: Playing Server Management');
  }
};
