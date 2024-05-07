const { writeParquetFile } = require('../utils/parquet.js');
const { SHIPMENT_RELATED_SHIPMENT_SCHEME } = require('../scheme/celonis/shipmentRelatedShipment.scheme.js');
const { sourceIdentifierTypes } = require('../config/constants.js');
const { logger } = require('../utils/logger.js');


/**
 * Parses the related shipments of a given shipment.
 * @param {Object} shipment - The shipment object.
 * @returns {Array} - An array of parsed related shipments.
 */
async function parseRelatedShipments(shipment) {
  const payload = [];

  if (shipment.relatedShipments && Array.isArray(shipment.relatedShipments)) {
    for (const relatedShipment of shipment.relatedShipments) {
      const r = {
        shipment_id: shipment.id,
        related_shipment_id: relatedShipment.id
      };
  
      for (const identifierType of sourceIdentifierTypes) {
        r[identifierType] = null;
      }
  
      if(relatedShipment.identifiers && Array.isArray(relatedShipment.identifiers)) {
        for (const identifier of relatedShipment.identifiers) {
          r[identifier.type.toLowerCase()] = identifier.value;
        }
      }
  
      payload.push(r);
    }
  }

  return payload;
}

/**
 * Processes the related shipments for a given shipment.
 * @param {Object} shipment - The shipment object.
 * @returns {Promise<void>} - A promise that resolves when the related shipments are processed.
 */
async function processRelatedShipments(shipment) {
  var relatedShipments = await parseRelatedShipments(shipment);
  if(relatedShipments.length === 0) {
    var fileName = await writeParquetFile(relatedShipments, 'shipment_related_shipments', SHIPMENT_RELATED_SHIPMENT_SCHEME, shipment.id);
    logger.info(`File ${fileName} Created.`);
  }
}

module.exports = {
  processRelatedShipments
};
