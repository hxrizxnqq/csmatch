const { Markup } = require('telegraf');

module.exports = async (ctx) => {
  const welcomeMessage = `
🎮 *Добро пожаловать в CSMatch Bot!*

Этот бот поможет тебе найти напарников для игры в CS2 и FaceIT матчей.

*Доступные команды:*
/start - Показать это сообщение
/linksteam - Привязать Steam аккаунт
/profile - Посмотреть свой профиль
/find - Найти напарников

Для начала работы привяжи свой Steam аккаунт командой /linksteam
  `.trim();

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback('🔗 Привязать Steam', 'link_steam')],
    [Markup.button.callback('👤 Мой профиль', 'my_profile')],
    [Markup.button.callback('🔍 Найти напарников', 'find_players')]
  ]);

  await ctx.reply(welcomeMessage, {
    parse_mode: 'Markdown',
    ...keyboard
  });
};