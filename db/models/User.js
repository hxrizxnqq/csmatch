const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  telegram_id: { type: Number, unique: true, required: true },
  steam_id: { type: String, default: null },
  faceit_id: { type: String, default: null },
  current_rank: { type: String, default: null },
  max_rank: { type: String, default: null },
  elo: { type: Number, default: 0 },
  filters: { type: Object, default: {} },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
