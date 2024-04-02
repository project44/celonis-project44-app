const { writeParquetFile,  deleteParquetFile } = require('../utils/parquet.js');
const { SHIPMENT_IDENTIFIER_SCHEME } = require('../scheme/celonis/shipmentIdentifier.scheme.js');
const { checkFileExistsSync } = require('../utils/util.js');
const { sendToCelonis } = require('../services/celonis.service.js');
const { logger } = require('../utils/logger.js');
const keys = [
  "shipment_id",
  "type",
  "value"
];

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
  var fileName = await writeParquetFile(identifiers, shipment.id, 'identifiers', SHIPMENT_IDENTIFIER_SCHEME);
  if(checkFileExistsSync(fileName)) {
    var response = await sendToCelonis(keys, fileName, 'shipment_identifiers');
    var id = null;
    if(response && response.data) {
      id = response.data.id;
    }
    await deleteParquetFile(fileName);
    return id;
  } else {
    logger.warn(`File ${fileName} does not exist`);
    return -1
  }
}

module.exports = {
  processIdentifiers
};