const express = require('express');
const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;
const { updateSteamId } = require('../db/users');

const router = express.Router();

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new SteamStrategy({
    returnURL: `${process.env.BASE_URL}/auth/steam/return`,
    realm: process.env.BASE_URL,
    apiKey: process.env.STEAM_API_KEY,
  },
  async (identifier, profile, done) => {
    process.nextTick(() => done(null, { steamID: profile.id, displayName: profile.displayName }));
  }
));

router.get('/steam', (req, res, next) => {
  if (!req.query.telegram_id) return res.status(400).send('telegram_id не указан');
  req.session.telegram_id = req.query.telegram_id;
  next();
}, passport.authenticate('steam'));

router.get('/steam/return', 
  passport.authenticate('steam', { failureRedirect: '/' }),
  async (req, res) => {
    const telegram_id = req.session.telegram_id;
    if (!telegram_id) return res.status(400).send('telegram_id отсутствует в сессии');

    try {
      await updateSteamId(telegram_id, req.user.steamID);
      res.send('Steam аккаунт успешно привязан к Telegram!');
    } catch (err) {
      res.status(500).send('Ошибка при сохранении steam_id');
    }
  }
);

module.exports = router;
