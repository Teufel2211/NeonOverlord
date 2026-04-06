/**
 * Error Event Handler
 */

import { logError } from '../utils/logger.js';

export default {
  name: 'error',
  execute(error) {
    logError('Discord.js error:', error);
  }
};
