const { writeParquetFile,  deleteParquetFile } = require('../utils/parquet.js');
const { SHIPMENT_POSITION_SCHEME } = require('../scheme/celonis/shipmentPosition.scheme.js');
const { sendToCelonis } = require('../services/celonis.service.js');
const { checkFileExistsSync } = require('../utils/util.js');
const { logger } = require('../utils/logger.js');
const keys = [
  "shipment_id",
  "date_time"
];

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
  var fileName = await writeParquetFile(positions, shipment.id, 'positions', SHIPMENT_POSITION_SCHEME);
  if(checkFileExistsSync(fileName)) {
    var response = await sendToCelonis(keys, fileName, 'shipment_positions');
    var id = null;
    if(response && response.data) {
      id = response.data.id;
    }
    deleteParquetFile(fileName);
    return id;  
  } else {
    logger.warn(`File ${fileName} does not exist`);
    return -1;  
  }
 }

 module.exports = {
  processPositions
};