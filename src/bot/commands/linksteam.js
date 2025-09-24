const { Markup } = require('telegraf');

module.exports = async (ctx) => {
  const userId = ctx.from.id;
  const username = ctx.from.username;
  
  // Generate unique auth URL for this user
  const authUrl = `${process.env.BASE_URL || 'http://localhost:3000'}/auth/steam?telegram_id=${userId}&username=${username}`;
  
  const message = `
🔗 *Привязка Steam аккаунта*

Для привязки Steam аккаунта нажми на кнопку ниже.
Ты будет перенаправлен на безопасную страницу Steam для авторизации.

⚠️ *Важно:* Убедись, что твой Steam профиль открыт для просмотра, чтобы бот мог получить информацию о твоих играх и статистике.
  `.trim();

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.url('🚀 Авторизоваться через Steam', authUrl)]
  ]);

  await ctx.reply(message, {
    parse_mode: 'Markdown',
    ...keyboard
  });
};