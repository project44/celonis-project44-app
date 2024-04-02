const { writeParquetFile,  deleteParquetFile } = require('../utils/parquet.js');
const { SHIPMENT_ATTRIBUTE_SCHEME } = require('../scheme/celonis/shipmentAttribute.scheme.js');
const { sendToCelonis } = require('../services/celonis.service.js');
const { checkFileExistsSync } = require('../utils/util.js');
const { logger } = require('../utils/logger.js');

const keys = [
  "shipment_id",
  "name",
  "value"
];

/**
 * Parses the attributes of a shipment and returns an array of attribute objects.
 * @param {Object} shipment - The shipment object containing attributes.
 * @returns {Array} - An array of attribute objects.
 */
async function parseAttributes(shipment) {
  const attributes = [];
  if(shipment.attributes && shipment.attributes.length > 0)
  {
    for (const attribute of shipment.attributes) {
      for (const value of attribute.values) {
        const a = {
          shipment_id: shipment.id,
          name: attribute.name,
          value: value
        };
        attributes.push(a);
      }
    }  
  }
  return attributes;
}

/**
 * Processes shipment attributes.
 * @param {Object} shipment - The shipment object.
 * @returns {Promise<number>} - The ID of the processed shipment attributes, or -1 if the file does not exist.
 */
async function processShipmentAttributes(shipment) {
  var shipmentAttributes = await parseAttributes(shipment);
  var fileName = await writeParquetFile(shipmentAttributes, shipment.id, 'shipment_attributes', SHIPMENT_ATTRIBUTE_SCHEME);
  if(checkFileExistsSync(fileName)) {
    var response = await sendToCelonis(keys, fileName, 'shipment_attributes');
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
};

module.exports = {
  processShipmentAttributes
};