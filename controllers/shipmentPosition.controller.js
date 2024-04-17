const { writeParquetFile } = require('../utils/parquet.js');
const { SHIPMENT_POSITION_SCHEME } = require('../scheme/celonis/shipmentPosition.scheme.js');
const { logger } = require('../utils/logger.js');

/**
 * Parses an array of positions and returns a new array of parsed positions.
 * Each parsed position object contains shipment-related information.
 *
 * @param {Array} positions - The array of positions to be parsed.
 * @param {Object} shipment - The shipment object containing shipment-related information.
 * @returns {Array} - The array of parsed positions.
 */
async function parsePositions(positions, shipment) {
  if(!positions) return null;

  var p = positions.map((position) => ({
    shipment_id: shipment.id,
    date_time: position.dateTime || null,
    received_date_time: position.receivedDateTime || null,
    route_segment_id: position.routeSegmentId || null,
    lattitude: position.latitude || null,
    longitude: position.longitude || null
  }));
  return p;
}

/**
 * Processes the positions and performs necessary operations.
 *
 * @param {Array} positions - The positions to be processed.
 * @param {Object} shipment - The shipment object.
 * @returns {Promise<void>} - A promise that resolves when the processing is complete.
 */
async function processPositions(positions, shipment) {
  var positions = await parsePositions(positions, shipment);
  var fileName = await writeParquetFile(positions, 'shipment_positions', SHIPMENT_POSITION_SCHEME, shipment.id);
  logger.info(`File ${fileName} Created.`);
}

 module.exports = {
  processPositions
};