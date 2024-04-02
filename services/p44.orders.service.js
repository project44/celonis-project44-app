const axios = require('axios');
const { P44_API_SERVER } = require('../config/config.js');
const { logger } = require('../utils/logger.js');

/**
 * Retrieves the attributes from the P44 API server.
 * @returns {Promise<Object>} The response data containing the attributes.
 * @throws {Error} If the request fails or the response status is not 200.
 */
async function getOrders(shipmentId) {
  let page = 1;
  let pageSize = 100;
  let totalPages = 1;

  let url = `${ P44_API_SERVER }/api/v4/inventory/orders/search?page=${page}&pageSize=${pageSize}`;

  let body = {
    "shipmentIds": [shipmentId]
  }

  let headers = {
    'Authorization': `Bearer ${global.auth.token}`,  
    'Content-Type': 'application/json'
  };

  let response = [];
  do {
    try {
      let res = await axios.post(url, body, {headers});
      totalPages = res.data.paginationInfo.total >= pageSize ? Math.ceil(res.data.paginationInfo.total / pageSize) : 1;
      response = response.concat(res.data.results);
      page++;
    } catch (error) {
      logger.error(`Failed to get orders: ${error.message}`);
      return response;
    }
  } while (page <= totalPages);

  return response;
}

module.exports = {
  getOrders
};