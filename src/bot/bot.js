const { Telegraf } = require('telegraf');

// Import commands
const startCommand = require('./commands/start');
const linksteamCommand = require('./commands/linksteam');

// Create bot instance
const bot = new Telegraf(process.env.BOT_TOKEN);

// Middleware
bot.use((ctx, next) => {
  console.log(`Received message from ${ctx.from.username}: ${ctx.message?.text || 'Non-text message'}`);
  return next();
});

// Register commands
bot.command('start', startCommand);
bot.command('linksteam', linksteamCommand);

// Default message handler
bot.on('text', (ctx) => {
  if (!ctx.message.text.startsWith('/')) {
    ctx.reply('Привет! Используй команды /start для начала или /linksteam для привязки Steam аккаунта.');
  }
});

module.exports = bot;