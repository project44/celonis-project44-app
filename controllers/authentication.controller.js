const { logger } = require('../utils/logger.js');
const AuthService = require('../services/p44.authentication.service.js');
const { PROJECT44_CLIENT_ID, PROJECT44_CLIENT_SECRET } = require('../config/config');
const dayjs = require('dayjs');
const httpStatus = require('http-status');

/**
 * Authenticates the credentials for the request. This middleware retrieves the token from 
 * the project44 Auth API and stores it in the global object. Tokens are valid for 12 hours.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the authentication is complete.
 * @throws {Error} - If there is an error retrieving or validating the token.
 */
const authenticateCredentials = async (req, res, next) => {
  try {
    // var authService;
    if(global.auth) {

    } else {
      global.auth = new AuthService(PROJECT44_CLIENT_ID, PROJECT44_CLIENT_SECRET)
    }

    var token = null;

    // Check if we have a token and it is still valid. It is not valid or if it is expired, get a new token.
    if(global.auth.token && global.auth.tokenExpires && dayjs().isBefore(global.auth.tokenExpires)) {
      logger.info('Using existing token');
      token = global.auth.token;
    } else {
      logger.info('Getting new token');
      const t = await global.auth.getToken();
      global.auth.token = t.access_token;
      global.auth.tokenExpires = dayjs().add(t.expires_in, 'second');
    }

    logger.info(`Token expires at: ${global.auth.tokenExpires}`);

    next();
  } catch (error) {
    logger.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to retrieve token' });
  }
};

module.exports = {
  authenticateCredentials,
};