const express = require('express');
const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;
const db = require('../../database/connection');

const router = express.Router();

// Configure Steam strategy
passport.use(new SteamStrategy({
    returnURL: `${process.env.BASE_URL || 'http://localhost:3000'}/auth/steam/return`,
    realm: process.env.BASE_URL || 'http://localhost:3000',
    apiKey: process.env.STEAM_API_KEY
  },
  async (identifier, profile, done) => {
    try {
      // Extract Steam ID from identifier
      const steamId = identifier.split('/').pop();
      
      // Save user data to database
      const userData = {
        steam_id: steamId,
        steam_username: profile.displayName,
        avatar_url: profile.photos?.[2]?.value || profile.photos?.[1]?.value || profile.photos?.[0]?.value,
        profile_url: profile._json.profileurl,
        updated_at: new Date()
      };

      // Here you would typically save to database
      // await db.saveOrUpdateUser(userData);
      
      return done(null, { ...userData, profile });
    } catch (error) {
      return done(error, null);
    }
  }
));

// Passport serialization
passport.serializeUser((user, done) => {
  done(null, user.steam_id);
});

passport.deserializeUser(async (steamId, done) => {
  try {
    const user = await db.getUserBySteamId(steamId);
    done(null, user || { steam_id: steamId });
  } catch (error) {
    done(error, null);
  }
});

// Steam auth route
router.get('/steam', (req, res, next) => {
  // Store Telegram user info in session
  if (req.query.telegram_id) {
    req.session.telegram_id = req.query.telegram_id;
    req.session.telegram_username = req.query.username;
  }
  
  passport.authenticate('steam', { failureRedirect: '/auth/error' })(req, res, next);
});

// Steam auth callback
router.get('/steam/return',
  passport.authenticate('steam', { failureRedirect: '/auth/error' }),
  async (req, res) => {
    try {
      const telegramId = req.session.telegram_id;
      const steamId = req.user.steam_id;
      
      if (telegramId && steamId) {
        // Check if user exists, create if not
        let user = await db.getUserByTelegramId(telegramId);
        if (!user) {
          await db.createUser({
            telegram_id: telegramId,
            telegram_username: req.session.telegram_username || ''
          });
        }
        
        // Link Steam account to Telegram user in database
        await db.linkSteamToTelegram(telegramId, req.user);
        
        // Success page
        res.send(`
          <html>
            <head>
              <title>Steam Account Linked</title>
              <meta charset="utf-8">
              <style>
                body { font-family: Arial, sans-serif; text-align: center; margin: 50px; }
                .success { color: #4CAF50; font-size: 24px; margin-bottom: 20px; }
                .info { font-size: 16px; color: #666; }
              </style>
            </head>
            <body>
              <div class="success">✅ Steam аккаунт успешно привязан!</div>
              <div class="info">
                <p>Привязан Steam аккаунт: <strong>${req.user.steam_username}</strong></p>
                <p>Теперь можешь закрыть эту вкладку и вернуться в Telegram бот.</p>
              </div>
            </body>
          </html>
        `);
      } else {
        throw new Error('Missing Telegram or Steam ID');
      }
    } catch (error) {
      console.error('Steam auth error:', error);
      res.redirect('/auth/error');
    }
  }
);

// Error route
router.get('/error', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Authentication Error</title>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; text-align: center; margin: 50px; }
          .error { color: #f44336; font-size: 24px; margin-bottom: 20px; }
          .info { font-size: 16px; color: #666; }
        </style>
      </head>
      <body>
        <div class="error">❌ Ошибка авторизации</div>
        <div class="info">
          <p>Не удалось привязать Steam аккаунт.</p>
          <p>Попробуй еще раз через Telegram бот.</p>
        </div>
      </body>
    </html>
  `);
});

module.exports = router;