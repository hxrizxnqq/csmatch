require('dotenv').config();
const db = require('./src/database/connection');
const bot = require('./src/bot/bot');
const server = require('./src/server/server');

// Initialize database connection
db.initializeTables()
  .then(() => {
    console.log('✅ Database initialized successfully');
  })
  .catch(err => {
    console.error('❌ Database initialization failed:', err);
    process.exit(1);
  });

// Start the bot
bot.launch()
  .then(() => {
    console.log('✅ Telegram bot started successfully');
  })
  .catch(err => {
    console.error('❌ Failed to start bot:', err);
    process.exit(1);
  });

// Start the Express server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Express server started on port ${PORT}`);
});

// Graceful shutdown
process.once('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully...');
  bot.stop('SIGINT');
  process.exit(0);
});

process.once('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  bot.stop('SIGTERM');
  process.exit(0);
});