/**
 * General utility functions
 */

/**
 * Validate environment variables
 */
function validateEnv() {
  const required = [
    'BOT_TOKEN',
    'STEAM_API_KEY'
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing.join(', '));
    process.exit(1);
  }
  
  console.log('✅ Environment variables validated');
}

/**
 * Format CS2 rank name
 * @param {number} rankId - CS2 rank ID
 */
function formatCS2Rank(rankId) {
  const ranks = {
    1: 'Silver I',
    2: 'Silver II', 
    3: 'Silver III',
    4: 'Silver IV',
    5: 'Silver Elite',
    6: 'Silver Elite Master',
    7: 'Gold Nova I',
    8: 'Gold Nova II',
    9: 'Gold Nova III',
    10: 'Gold Nova Master',
    11: 'Master Guardian I',
    12: 'Master Guardian II',
    13: 'Master Guardian Elite',
    14: 'Distinguished Master Guardian',
    15: 'Legendary Eagle',
    16: 'Legendary Eagle Master',
    17: 'Supreme Master First Class',
    18: 'The Global Elite'
  };
  
  return ranks[rankId] || 'Unranked';
}

/**
 * Generate random string for session secrets
 * @param {number} length - Length of the string
 */
function generateRandomString(length = 32) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

/**
 * Sleep for a given amount of time
 * @param {number} ms - Milliseconds to sleep
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Escape special characters for Telegram markdown
 * @param {string} text - Text to escape
 */
function escapeMarkdown(text) {
  return text.replace(/[_*[\]()~`>#+-=|{}.!]/g, '\\$&');
}

module.exports = {
  validateEnv,
  formatCS2Rank,
  generateRandomString,
  sleep,
  escapeMarkdown
};