/**
 * Utility functions for Steam API interactions
 */

const axios = require('axios');

class SteamUtils {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.steampowered.com';
  }

  /**
   * Get CS2 player stats
   * @param {string} steamId - Steam ID of the player
   */
  async getCS2Stats(steamId) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/ISteamUserStats/GetUserStatsForGame/v0002/`,
        {
          params: {
            appid: 730, // CS2 app ID
            key: this.apiKey,
            steamid: steamId
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching CS2 stats:', error.message);
      return null;
    }
  }

  /**
   * Get player's game library
   * @param {string} steamId - Steam ID of the player
   */
  async getOwnedGames(steamId) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/IPlayerService/GetOwnedGames/v0001/`,
        {
          params: {
            key: this.apiKey,
            steamid: steamId,
            format: 'json',
            include_appinfo: true,
            include_played_free_games: true
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching owned games:', error.message);
      return null;
    }
  }

  /**
   * Check if player owns CS2
   * @param {string} steamId - Steam ID of the player
   */
  async hasCS2(steamId) {
    const games = await this.getOwnedGames(steamId);
    if (!games || !games.response || !games.response.games) {
      return false;
    }
    
    return games.response.games.some(game => game.appid === 730);
  }
}

module.exports = SteamUtils;