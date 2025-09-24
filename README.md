# CSMatch - Telegram Bot for CS2 Teammates

A Telegram bot that helps you find teammates for CS2 and FaceIT matches with Steam integration.

## Features

- 🎮 Find teammates for CS2 matches
- 🔗 Steam account integration via OpenID
- 👤 Player profiles with stats
- 🏆 Rank-based matchmaking
- 🎯 FaceIT integration support

## Setup

### Prerequisites

- Node.js 16+ 
- MongoDB database
- Telegram Bot Token (from @BotFather)
- Steam API Key (from https://steamcommunity.com/dev/apikey)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/hxrizxnqq/csmatch.git
cd csmatch
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
```bash
cp config/.env.example .env
# Edit .env with your configuration
```

4. Set up MongoDB database:
```bash
# Start MongoDB service
sudo systemctl start mongod
# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

5. Run the application:
```bash
npm start
```

## Configuration

Edit the `.env` file with your settings:

- `BOT_TOKEN` - Your Telegram bot token
- `STEAM_API_KEY` - Steam API key for user data
- `MONGODB_URI` - MongoDB connection string
- `BASE_URL` - Your server URL for Steam auth callbacks

## Project Structure

```
src/
├── bot/
│   ├── bot.js              # Telegram bot initialization
│   └── commands/           # Bot command handlers
│       ├── start.js        # /start command
│       └── linksteam.js    # /linksteam command
├── server/
│   ├── server.js           # Express server setup
│   └── routes/
│       └── auth.js         # Steam OpenID authentication
├── database/
│   └── connection.js       # MongoDB connection and schemas
└── utils/
    ├── steam.js           # Steam API utilities
    └── helpers.js         # General utility functions
config/
├── config.js              # Configuration loader
└── .env.example           # Environment template
```

## Available Commands

- `/start` - Welcome message and main menu
- `/linksteam` - Link Steam account via OpenID
- `/profile` - View your profile and stats (coming soon)
- `/find` - Find teammates (coming soon)

## License

MIT License - see [LICENSE](LICENSE) file for details.
