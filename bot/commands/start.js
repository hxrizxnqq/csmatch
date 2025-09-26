const { createUser } = require('../../db/users');

module.exports = async (ctx) => {
  await createUser(ctx.from.id);
  ctx.reply('Привет! Используйте /linksteam, чтобы связать ваш Steam аккаунт.');
};
