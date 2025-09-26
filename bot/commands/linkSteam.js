module.exports = (ctx) => {
  const authUrl = `${process.env.BASE_URL}/auth/steam?telegram_id=${ctx.from.id}`;
  ctx.reply(`Нажмите по ссылке, чтобы привязать Steam:\n${authUrl}`);
};
