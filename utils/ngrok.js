const ngrok = require('ngrok');
const fs = require('fs');
const path = require('path');

class NgrokManager {
  constructor() {
    this.url = null;
    this.isConnected = false;
  }

  async start(port = 3000) {
    try {
      console.log('🚀 Запускаем ngrok туннель...');
      
      // Запускаем ngrok туннель с дополнительными опциями
      this.url = await ngrok.connect({
        proto: 'http',
        addr: port,
        region: 'eu',
        onStatusChange: status => {
          console.log(`📊 Ngrok статус: ${status}`);
        },
        onLogEvent: data => {
          if (data.level === 'ERROR') {
            console.error(`❌ Ngrok ошибка: ${data.msg}`);
          }
        },
      });

      this.isConnected = true;
      
      console.log(`✅ Ngrok туннель создан: ${this.url}`);
      
      // Обновляем .env файл с новым URL
      await this.updateEnvFile();
      
      // Обновляем переменную окружения в текущем процессе
      process.env.BASE_URL = this.url;
      
      return this.url;
    } catch (error) {
      console.error('❌ Ошибка при запуске ngrok:', error.message);
      console.log('💡 Попробуйте установить ngrok глобально: npm install -g ngrok');
      
      // В качестве fallback используем localtunnel
      console.log('🔄 Пробуем использовать fallback решение...');
      return await this.startFallback(port);
    }
  }

  async startFallback(port) {
    try {
      // Используем простой HTTP сервер без туннеля как fallback
      const fallbackUrl = `http://localhost:${port}`;
      console.log(`⚠️  Используем локальный URL: ${fallbackUrl}`);
      console.log('💡 Для работы с Telegram webhook вам нужен публичный URL');
      
      this.url = fallbackUrl;
      this.isConnected = true;
      
      await this.updateEnvFile();
      process.env.BASE_URL = this.url;
      
      return this.url;
    } catch (error) {
      console.error('❌ Fallback тоже не сработал:', error.message);
      throw error;
    }
  }

  async updateEnvFile() {
    try {
      const envPath = path.join(process.cwd(), '.env');
      let envContent = fs.readFileSync(envPath, 'utf8');
      
      // Заменяем BASE_URL на новый ngrok URL
      const baseUrlRegex = /^BASE_URL=.*$/m;
      
      if (baseUrlRegex.test(envContent)) {
        envContent = envContent.replace(baseUrlRegex, `BASE_URL=${this.url}`);
      } else {
        // Если BASE_URL не найден, добавляем его
        envContent += `\nBASE_URL=${this.url}`;
      }
      
      fs.writeFileSync(envPath, envContent);
      console.log('📝 Файл .env обновлен с новым URL');
    } catch (error) {
      console.error('❌ Ошибка при обновлении .env файла:', error.message);
    }
  }

  async stop() {
    if (this.isConnected) {
      try {
        await ngrok.kill();
        this.isConnected = false;
        this.url = null;
        console.log('⏹️  Ngrok туннель остановлен');
      } catch (error) {
        console.error('❌ Ошибка при остановке ngrok:', error.message);
      }
    }
  }

  async restart(port = 3000) {
    console.log('🔄 Перезапускаем ngrok туннель...');
    await this.stop();
    await new Promise(resolve => setTimeout(resolve, 2000)); // Увеличиваем паузу
    return await this.start(port);
  }

  getUrl() {
    return this.url;
  }

  isRunning() {
    return this.isConnected;
  }
}

module.exports = new NgrokManager();
