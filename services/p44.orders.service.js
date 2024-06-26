const axios = require('axios');
const { P44_API_SERVER } = require('../config/config.js');
const { logger } = require('../utils/logger.js');


/**
 * Retrieves orders for a given shipment ID.
 *
 * @param {string} shipmentId - The ID of the shipment.
 * @returns {Promise<Array>} - A promise that resolves to an array of orders.
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