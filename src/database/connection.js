const mysql = require('mysql2');

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'csmatch',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000
});

// Get promisified version
const promisePool = pool.promise();

// Test database connection
const testConnection = async () => {
  try {
    const [rows] = await promisePool.execute('SELECT 1 as test');
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Initialize database tables
const initializeTables = async () => {
  try {
    // Users table
    await promisePool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        telegram_id BIGINT UNIQUE NOT NULL,
        telegram_username VARCHAR(255),
        steam_id VARCHAR(255) UNIQUE,
        steam_username VARCHAR(255),
        avatar_url TEXT,
        profile_url TEXT,
        cs2_rank VARCHAR(50),
        faceit_level INT,
        faceit_elo INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_telegram_id (telegram_id),
        INDEX idx_steam_id (steam_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Match requests table
    await promisePool.execute(`
      CREATE TABLE IF NOT EXISTS match_requests (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        game_type ENUM('cs2', 'faceit') NOT NULL,
        rank_requirement VARCHAR(50),
        message TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_active (is_active),
        INDEX idx_game_type (game_type)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('✅ Database tables initialized');
  } catch (error) {
    console.error('❌ Failed to initialize tables:', error.message);
  }
};

// Database methods
const db = {
  pool: promisePool,
  testConnection,
  initializeTables,
  
  // User methods
  async getUserByTelegramId(telegramId) {
    const [rows] = await promisePool.execute(
      'SELECT * FROM users WHERE telegram_id = ?',
      [telegramId]
    );
    return rows[0] || null;
  },

  async getUserBySteamId(steamId) {
    const [rows] = await promisePool.execute(
      'SELECT * FROM users WHERE steam_id = ?',
      [steamId]
    );
    return rows[0] || null;
  },

  async createUser(userData) {
    const [result] = await promisePool.execute(
      'INSERT INTO users (telegram_id, telegram_username) VALUES (?, ?)',
      [userData.telegram_id, userData.telegram_username]
    );
    return result.insertId;
  },

  async linkSteamToTelegram(telegramId, steamData) {
    await promisePool.execute(
      `UPDATE users SET 
        steam_id = ?, 
        steam_username = ?, 
        avatar_url = ?, 
        profile_url = ?,
        updated_at = CURRENT_TIMESTAMP
       WHERE telegram_id = ?`,
      [
        steamData.steam_id,
        steamData.steam_username,
        steamData.avatar_url,
        steamData.profile_url,
        telegramId
      ]
    );
  }
};

module.exports = db;