const User = require('./models/User');

async function createUser(telegram_id) {
  let user = await User.findOne({ telegram_id });
  if (!user) {
    user = new User({ telegram_id });
    await user.save();
  }
  return user;
}

async function updateSteamId(telegram_id, steam_id) {
  await User.findOneAndUpdate(
    { telegram_id }, 
    { steam_id: steam_id, updated_at: Date.now() },
    { upsert: true }
  );
}

async function getUserByTelegramId(telegram_id) {
  return await User.findOne({ telegram_id });
}

module.exports = {
  createUser,
  updateSteamId,
  getUserByTelegramId,
};
