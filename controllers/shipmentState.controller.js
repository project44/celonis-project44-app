const { writeParquetFile } = require('../utils/parquet.js');
const { SHIPMENT_STATE_SCHEME } = require('../scheme/celonis/shipmentState.scheme.js');
const { logger } = require('../utils/logger.js');

/**
 * Parses an array of states and returns a new array of parsed states.
 *
 * @param {Array} states - The array of states to be parsed.
 * @param {Object} shipment - The shipment object.
 * @returns {Array} - The array of parsed states.
 */
async function parseStates(states, shipment) {
  if (!states) return null;

  var s = states.map((state) => ({
    shipment_id: shipment.id,
    type: state.type,
    start_date_time: state.startDateTime || null, 
    end_date_time: state.endDateTime || null,
    stop_id: state.stopId || null,
    route_segment_id: state.routeSegmentId || null
  }));
  return s;
}

/**
 * Processes the states data and performs necessary operations.
 *
 * @param {Array} states - The states data to be processed.
 * @param {Object} shipment - The shipment object.
 * @returns {Promise<void>} - A promise that resolves when the processing is complete.
 */
async function processStates(states, shipment) {
  var states = await parseStates(states, shipment);
  var fileName = await writeParquetFile(states, 'shipment_states', SHIPMENT_STATE_SCHEME, shipment.id);
  logger.info(`File ${fileName} Created.`);
}

module.exports = {
  processStates
};
