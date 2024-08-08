const { writeParquetFile } = require('../../utils/parquet.js');
const { SHIPMENT_ATTRIBUTE_SCHEME } = require('../../scheme/celonis/shipmentAttribute.scheme.js');
const { logger } = require('../../utils/logger.js');

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
  var fileName = await writeParquetFile(shipmentAttributes, 'shipment_attributes', SHIPMENT_ATTRIBUTE_SCHEME, shipment.id);
  logger.info(`File ${fileName} Created.`);
};

module.exports = {
  processShipmentAttributes
};