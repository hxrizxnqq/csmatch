require('dotenv').config();
const { Telegraf } = require('telegraf');

const start = require('./commands/start');
const linkSteam = require('./commands/linkSteam');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(start);
bot.command('linksteam', linkSteam);

module.exports = bot;
