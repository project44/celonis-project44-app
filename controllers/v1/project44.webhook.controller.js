const httpStatus = require('http-status');  
const { processIdentifiers } = require('./shipmentIdentifier.controller.js');
const { processStops } = require('./shipmentStop.controller.js');
const { processRouteSegements } = require('./shipmentRouteSegment.controller.js');
const { processRelatedShipments } = require('./shipmentRelatedShipment.controller.js');
const { processStates } = require('./shipmentState.controller.js');
const { processEvents } = require('./shipmentEvent.controller.js');
const { processEventDetails } = require('./shipmentEventDetail.controller.js');
const { processPositions } = require('./shipmentPosition.controller.js');
const { processShipmentAttributes } = require('./shipmentAttributes.controller.js');
const { processOrders } = require('./shipmentOrder.controller.js');
const { processOrderItems } = require('./shipmentOrderItem.controller.js');

const { PROJECT44_INCLUDE_ORDERS, PROJECT44_INCLUDE_ORDER_ITEMS } = require('../../config/config.js');
const logger = require('../../utils/logger.js');
const fs = require('fs');
const path = require('path');

/**
 * Handles the receipt of a webhook from project44.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
const receivePost = async (req, res, next) => {

  var response = {};
  response.message = 'Received webhook from project44';
  response.status = httpStatus.ACCEPTED;
  res.status(httpStatus.ACCEPTED).send(response);
  await parseAndProcessShipment(req, res, next);
}

async function parseAndProcessShipment(req, res, next) {
  await processIdentifiers(req.body.shipment);
  await processStops(req.body.shipment);
  await processRouteSegements(req.body.shipment);
  await processRelatedShipments(req.body.shipment);
  await processStates(req.body.states, req.body.shipment);
  await processEvents(req.body.events, req.body.shipment);
  await processEventDetails(req.body.events, req.body.shipment);
  await processPositions(req.body.positions, req.body.shipment);
  await processShipmentAttributes(req.body.shipment);

  if(PROJECT44_INCLUDE_ORDERS) {
    await processOrders(req.body.shipment);
  }

  if(PROJECT44_INCLUDE_ORDER_ITEMS) {
    await processOrderItems(req.body.shipment);
  }  
}

module.exports = {
  receivePost
}
