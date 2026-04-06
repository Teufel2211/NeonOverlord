/**
 * Logger Utility
 * Provides consistent logging with timestamps and color coding
 */

const LogLevel = {
  SUCCESS: '#00FF00',
  ERROR: '#FF0000',
  INFO: '#0099FF',
  WARN: '#FFFF00',
  DEBUG: '#888888'
};

export function logSuccess(message) {
  console.log(`[✅ SUCCESS] ${new Date().toLocaleTimeString()}: ${message}`);
}

export function logError(message, error = null) {
  console.error(`[❌ ERROR] ${new Date().toLocaleTimeString()}: ${message}`);
  if (error) console.error(error);
}

export function logInfo(message) {
  console.log(`[ℹ️  INFO] ${new Date().toLocaleTimeString()}: ${message}`);
}

export function logWarn(message) {
  console.warn(`[⚠️  WARN] ${new Date().toLocaleTimeString()}: ${message}`);
}

export function logDebug(message) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[🐛 DEBUG] ${new Date().toLocaleTimeString()}: ${message}`);
  }
}
