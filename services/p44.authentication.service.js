const axios = require('axios');
const { P44_API_SERVER } = require('../config/config');

class AuthService {
  constructor(clientId, clientSecret) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.token = null;
    this.tokenExpires = null;
  }

  /**
   * Retrieves an OAuth2 token from the P44 API server.
   * @returns {Promise<Object>} A promise that resolves to the token object.
   * @throws {Error} If the request to get the token fails.
   */
  async getToken() {
    const url = `${ P44_API_SERVER }/api/v4/oauth2/token`;
    const data = {
      grant_type: 'client_credentials',
      client_id: this.clientId,
      client_secret: this.clientSecret
    };

    var headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    const response = await axios.post(url, data, { headers });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Failed to get token: ${response.statusText}`);
    }
  }
}

module.exports = AuthService;
