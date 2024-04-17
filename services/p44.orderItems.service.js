const axios = require('axios');
const { P44_API_SERVER } = require('../config/config.js');
const { logger } = require('../utils/logger.js');


/**
 * Retrieves order items for a given shipment and order.
 *
 * @param {string} shipmentId - The ID of the shipment.
 * @param {string} orderId - The ID of the order.
 * @returns {Array} - An array of order items.
 */
async function getOrderItems(shipmentId, orderId) {
  let page = 1;
  let pageSize = 100;
  let totalPages = 1;

  let url = `${ P44_API_SERVER }/api/v4/inventory/items/search?page=${page}&size=${pageSize}`;

  let body = {
    "orderIds": [orderId],
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
      logger.error(`Failed to get order items: ${error.message}`);
      return response;
    }
  } while (page <= totalPages);

  return response;
}

module.exports = {
  getOrderItems
};