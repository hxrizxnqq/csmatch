require('dotenv').config();
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const authSteamRoutes = require('./authSteam');

const app = express();

// Настройка сессий для всего приложения
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // для разработки, в продакшене должно быть true с HTTPS
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authSteamRoutes);

app.get('/', (req, res) => res.send('CS Match Bot server running'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Express сервер запущен на порту ${PORT}`));
