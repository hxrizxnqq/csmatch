const mongoose = require('mongoose');
require('dotenv').config();

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB подключена');
  } catch (err) {
    console.error('Ошибка подключения к MongoDB', err);
  }
}

module.exports = connectDB;
