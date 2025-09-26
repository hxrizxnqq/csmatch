const connectDB = require('./db/connection');
const bot = require('./bot');
const ngrokManager = require('./utils/ngrok');
const ngrokWatcher = require('./utils/ngrok-watcher');
require('./server/index');

(async () => {
  try {
    // Подключаемся к базе данных
    await connectDB();
    
    // Запускаем ngrok туннель
    const ngrokUrl = await ngrokManager.start(3000);
    console.log(`🌐 Ngrok URL: ${ngrokUrl}`);
    
    // Запускаем мониторинг ngrok туннеля
    await ngrokWatcher.start();
    
    // Запускаем бота
    bot.launch();
    console.log('✅ Telegram бот запущен и база подключена');
    
    // Обработка выключения приложения
    process.on('SIGINT', async () => {
      console.log('\n🛑 Получен сигнал завершения...');
      ngrokWatcher.stop();
      await ngrokManager.stop();
      bot.stop();
      process.exit(0);
    });
    
    process.on('SIGTERM', async () => {
      console.log('\n🛑 Получен сигнал завершения...');
      ngrokWatcher.stop();
      await ngrokManager.stop();
      bot.stop();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Ошибка при запуске приложения:', error);
    process.exit(1);
  }
})();
