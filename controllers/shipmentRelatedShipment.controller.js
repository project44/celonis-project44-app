const { writeParquetFile,  deleteParquetFile } = require('../utils/parquet.js');
const { SHIPMENT_RELATED_SHIPMENT_SCHEME } = require('../scheme/celonis/shipmentRelatedShipment.scheme.js');
const { sourceIdentifierTypes } = require('../config/constants.js');
const { sendToCelonis } = require('../services/celonis.service.js');
const { checkFileExistsSync } = require('../utils/util.js');
const { logger } = require('../utils/logger.js');
const keys = [
  "shipment_id",
  "related_shipment_id"
];


/**
 * Parses the related shipments of a given shipment.
 * @param {Object} shipment - The shipment object.
 * @returns {Array} - An array of parsed related shipments.
 */
async function parseRelatedShipments(shipment) {
  const payload = [];

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

  return payload;
}

/**
 * Processes the related shipments for a given shipment.
 * @param {Object} shipment - The shipment object.
 * @returns {Promise<void>} - A promise that resolves when the related shipments are processed.
 */
async function processRelatedShipments(shipment) {
  var relatedShipments = await parseRelatedShipments(shipment);
  var fileName = await writeParquetFile(relatedShipments, shipment.id, 'related_shipments', SHIPMENT_RELATED_SHIPMENT_SCHEME);
  if(checkFileExistsSync(fileName)) {
    var response = await sendToCelonis(keys, fileName, 'shipment_related_shipments');
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
  processRelatedShipments
};
