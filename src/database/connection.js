const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  telegram_id: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },
  telegram_username: String,
  steam_id: {
    type: String,
    unique: true,
    sparse: true,
    index: true
  },
  steam_username: String,
  avatar_url: String,
  profile_url: String,
  cs2_rank: String,
  faceit_level: Number,
  faceit_elo: Number
}, {
  timestamps: true  // Creates createdAt and updatedAt automatically
});

// Match Request Schema
const matchRequestSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  game_type: {
    type: String,
    enum: ['cs2', 'faceit'],
    required: true,
    index: true
  },
  rank_requirement: String,
  message: String,
  is_active: {
    type: Boolean,
    default: true,
    index: true
  },
  expires_at: Date
}, {
  timestamps: true
});

// Create models
const User = mongoose.model('User', userSchema);
const MatchRequest = mongoose.model('MatchRequest', matchRequestSchema);

// Connect to MongoDB
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/csmatch';
    await mongoose.connect(uri);
    console.log('✅ MongoDB connection successful');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    return false;
  }
};

// Test database connection
const testConnection = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log('✅ Database connection successful');
      return true;
    } else {
      return await connectDB();
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Initialize database (ensures connection and indexes)
const initializeTables = async () => {
  try {
    await connectDB();
    
    // Ensure indexes are created
    await User.createIndexes();
    await MatchRequest.createIndexes();
    
    console.log('✅ Database collections and indexes initialized');
  } catch (error) {
    console.error('❌ Failed to initialize collections:', error.message);
  }
};

// Database methods
const db = {
  User,
  MatchRequest,
  connectDB,
  testConnection,
  initializeTables,
  
  // User methods
  async getUserByTelegramId(telegramId) {
    try {
      const user = await User.findOne({ telegram_id: telegramId });
      return user;
    } catch (error) {
      console.error('Error getting user by telegram ID:', error.message);
      return null;
    }
  },

  async getUserBySteamId(steamId) {
    try {
      const user = await User.findOne({ steam_id: steamId });
      return user;
    } catch (error) {
      console.error('Error getting user by steam ID:', error.message);
      return null;
    }
  },

  async createUser(userData) {
    try {
      const user = new User({
        telegram_id: userData.telegram_id,
        telegram_username: userData.telegram_username
      });
      const savedUser = await user.save();
      return savedUser._id;
    } catch (error) {
      console.error('Error creating user:', error.message);
      throw error;
    }
  },

  async linkSteamToTelegram(telegramId, steamData) {
    try {
      const result = await User.updateOne(
        { telegram_id: telegramId },
        {
          $set: {
            steam_id: steamData.steam_id,
            steam_username: steamData.steam_username,
            avatar_url: steamData.avatar_url,
            profile_url: steamData.profile_url,
            updatedAt: new Date()
          }
        }
      );
      return result;
    } catch (error) {
      console.error('Error linking steam to telegram:', error.message);
      throw error;
    }
  }
};

module.exports = db;