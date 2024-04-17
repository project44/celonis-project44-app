const axios = require('axios');
const { P44_API_SERVER } = require('../config/config.js');
const { logger } = require('../utils/logger.js');

/**
 * Retrieves the attributes from the P44 API server.
 * @returns {Promise<Object>} The response data containing the attributes.
 * @throws {Error} If the request fails or the response status is not 200.
 */
async function getAttributes() {
  const url = `${ P44_API_SERVER }/api/v4/shipmentattributedefinitions`;

  var headers = {
    'Authorization': `Bearer  ${global.auth.token}`,  
    'Content-Type': 'application/json'
  };
  const response = await axios.get(url, {headers});

  if (response.status === 200) {
    return response.data;
  } else {
    logger.error(`Failed to get attributes: ${response.statusText}`);
    return [];
  }
}

/**
 * Processes the shipment attributes.
 * 
 * @param {Object} shipment - The shipment object.
 * @returns {Promise<Object>} - A promise that resolves to the attributes.
 */
async function processShipmentAttributes(shipment) {  
  var attributes = await getAttributes();
  return attributes;
}

module.exports = {
  processShipmentAttributes
};