const { writeParquetFile } = require('../utils/parquet.js');
const { SHIPMENT_IDENTIFIER_SCHEME } = require('../scheme/celonis/shipmentIdentifier.scheme.js');
const { logger } = require('../utils/logger.js');

/**
 * Parses the identifiers of a shipment.
 * @param {Object} shipment - The shipment object.
 * @returns {Array} - An array of parsed identifiers.
 */
async function parseIdentifiers(shipment) {
  var i = shipment.identifiers.map((identifier) => ({
      shipment_id: shipment.id,
      type: identifier.type,
      value: identifier.value
    }));
  return i;
}

/**
 * Processes the identifiers of a shipment. Parses the identifiers and writes them to a Parquet file. 
 * Once the file has been sent to Celonis this file is deleted.
 * 
 * @param {Object} shipment - The shipment object.
 * @returns {Promise<void>} - A promise that resolves when the identifiers are processed.
 */
async function processIdentifiers(shipment) {
  var identifiers = await parseIdentifiers(shipment);
  var fileName = await writeParquetFile(identifiers, 'shipment_identifiers', SHIPMENT_IDENTIFIER_SCHEME, shipment.id);
  logger.info(`File ${fileName} Created.`);
}

module.exports = {
  processIdentifiers
};