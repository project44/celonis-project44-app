const { writeParquetFile } = require('../utils/parquet.js');
const { SHIPMENT_STOP_SCHEME } = require('../scheme/celonis/shipmentStop.scheme.js');
const { stopIdentifierTypes } = require('../config/constants.js');
const { logger } = require('../utils/logger.js');

/**
 * Parses the stops of a shipment and returns an array of stop objects.
 *
 * @param {Object} shipment - The shipment object containing route information.
 * @returns {Array} - An array of stop objects.
 */
async function parseStops(shipment) {
  const stops = [];
  for( const stop of shipment.routeInfo.stops) {
   var s = {
     shipment_id: shipment.id,
     stop_id: stop.id,
     address_line_1: stop.location ? stop.location.address[0] || null : null,
     address_line_2: stop.location ? stop.location.address[1] || null : null,
     address_line_3: stop.location ? stop.location.address[2] || null : null,
     city: stop.location && stop.location.address ? stop.location.address.city || null : null,
     state: stop.location && stop.location.address ? stop.location.address.state || null : null,
     postal_code: stop.location && stop.location.address ? stop.location.address.postalCode || null : null,
     country: stop.location && stop.location.address ? stop.location.address.country || null : null,
     time_zone: stop.location ? stop.location.timeZone : null,
     latitude: stop.location && stop.location.coordinates ? stop.location.coordinates.latitude : null,
     longitude: stop.location && stop.location.coordinates ? stop.location.coordinates.longitude : null
   };

   for(const identifierType of stopIdentifierTypes) {
     s[identifierType] = null;
   };

   if(stop.location && stop.location.identifiers && stop.location.identifiers.length > 0) {
      for( const identifier of stop.location.identifiers) {
        s[identifier.type.toLowerCase()] = identifier.value;
      }
    }

   stops.push(s);
  }
 return stops;
}

/**
* Processes the stops of a shipment. Parses the shipment stops and writes them to a Parquet file. 
* Once the file has been sent to Celonis this file is deleted.
* 
* @param {Object} shipment - The shipment object.
* @returns {Promise<void>} - A promise that resolves when the stops are processed.
*/
async function processStops(shipment) {
  var stops = await parseStops(shipment);
  var fileName = await writeParquetFile(stops, 'shipment_stops', SHIPMENT_STOP_SCHEME, shipment.id);
  logger.info(`File ${fileName} Created.`);
}

module.exports = {
  processStops
};