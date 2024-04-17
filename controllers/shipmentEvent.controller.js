const { writeParquetFile } = require('../utils/parquet.js');
const { SHIPMENT_EVENT_SCHEME } = require('../scheme/celonis/shipmentEvent.scheme.js');
const { logger } = require('../utils/logger.js');

/**
 * Parses the events array and maps it to a new array with the required properties.
 * @param {Array} events - The array of events to be parsed.
 * @param {Object} shipment - The shipment object.
 * @returns {Array} - The parsed events array.
 */
async function parseEvents(events, shipment) {
  if (!events) return null; 

  var e = events.map((event) => ({
    shipment_id: shipment.id,
    type: event.type || null,
    date_time: event.dateTime || null,
    received_date_time: event.receivedDateTime || null,
    description: event.description || null,
    stop_id: event.stopId || null,
    route_segment_id: event.routeSegmentId || null,
    estimate_date_time: event.estimateDateTime || null,
    estimate_last_calculated_date_time: event.estimateLastCalculatedDateTime || null,
    planned_date_time: event.plannedDateTime || null,
    planned_end_date_time: event.plannedEndDateTime || null
  }));
  return e;
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
  var fileName = await writeParquetFile(events, 'shipment_events', SHIPMENT_EVENT_SCHEME, shipment.id);
  logger.info(`File ${fileName} Created.`);
}
 
 module.exports = {
  processEvents
};