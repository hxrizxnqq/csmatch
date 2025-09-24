const express = require('express');
const session = require('express-session');
const passport = require('passport');

// Import routes
const authRoutes = require('./routes/auth');

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'csmatch-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'CSMatch Bot API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      steam_auth: '/auth/steam',
      steam_return: '/auth/steam/return'
    }
  });
});

module.exports = app;