const { writeParquetFile } = require('../../utils/parquet.js');
const { SHIPMENT_EVENT_SCHEME } = require('../../scheme/celonis/shipmentEvent.scheme.js');
const { logger } = require('../../utils/logger.js');

/**
 * Parses the events array and maps it to a new array with the required properties.
 * @param {Array} events - The array of events to be parsed.
 * @param {Object} shipment - The shipment object.
 * @returns {Array} - The parsed events array.
 */
async function parseEvents(events, shipment) {
  var response = [];

  events.forEach(event => {
    if(shipment.id && event.type && event.stopId && event.routeSegmentId) {
      var item = {};
      item.shipment_id = shipment.id;
      item.type = event.type || null;
      item.date_time = event.dateTime || null;
      item.received_date_time = event.receivedDateTime || null;
      item.description = event.description || null;
      item.stop_id = event.stopId || null;
      item.route_segment_id = event.routeSegmentId || null;
      item.estimate_date_time = event.estimateDateTime || null;
      item.estimate_last_calculated_date_time = event.estimateLastCalculatedDateTime || null;
      item.planned_date_time = event.plannedDateTime || null;
      item.planned_end_date_time = event.plannedEndDateTime || null;
      response.push(item);
    }
  });
  return response;
}

/**
 * Processes the events for a shipment.
 *
 * @param {Array} events - The events to be processed.
 * @param {Object} shipment - The shipment object.
 * @returns {Promise<void>} - A promise that resolves when the events are processed.
 */
async function processEvents(events, shipment) {
  var events = await parseEvents(events, shipment);
  if(events.length === 0) {
    logger.warn(`No events found for shipment ${shipment.id}.`);
    return;
  }
  var fileName = await writeParquetFile(events, 'shipment_events', SHIPMENT_EVENT_SCHEME, shipment.id);
  logger.info(`File ${fileName} Created.`);
}
 
 module.exports = {
  processEvents
};