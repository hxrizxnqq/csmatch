/**
 * Configuration loader and validator
 */

const { validateEnv } = require('../src/utils/helpers');

// Validate environment variables on load
validateEnv();

const config = {
  // Bot configuration
  bot: {
    token: process.env.BOT_TOKEN,
  },

  // Server configuration
  server: {
    port: parseInt(process.env.PORT) || 3000,
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    sessionSecret: process.env.SESSION_SECRET || 'csmatch-default-secret',
  },

  // Database configuration
  database: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'csmatch',
    port: parseInt(process.env.DB_PORT) || 3306,
  },

  // Steam API configuration
  steam: {
    apiKey: process.env.STEAM_API_KEY,
  },

  // FaceIT API configuration (optional)
  faceit: {
    apiKey: process.env.FACEIT_API_KEY || null,
  },

  // Application settings
  app: {
    environment: process.env.NODE_ENV || 'development',
    isDevelopment: process.env.NODE_ENV !== 'production',
    isProduction: process.env.NODE_ENV === 'production',
  }
};

module.exports = config;