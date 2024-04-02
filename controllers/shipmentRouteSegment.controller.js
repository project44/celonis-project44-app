const { writeParquetFile,  deleteParquetFile } = require('../utils/parquet.js');
const { SHIPMENT_ROUTE_SEGMENT_SCHEME } = require('../scheme/celonis/shipmentRouteSegment.scheme.js');
const { sourceIdentifierTypes } = require('../config/constants.js');
const { sendToCelonis } = require('../services/celonis.service.js');
const { checkFileExistsSync } = require('../utils/util.js');
const { logger } = require('../utils/logger.js');
const keys = [
  "shipment_id",
  "segment_id",
  "from_stop_id",
  "to_stop_id",
  "mode"
];

/**
 * Parses the route segments of a shipment and returns an array of route segments.
 * @param {Object} shipment - The shipment object containing route information.
 * @returns {Array} - An array of route segments.
 */
async function parseRouteSegments(shipment) {
  const routeSegments = [];

  for (const segment of shipment.routeInfo.routeSegments) {
    const s = {
      shipment_id: shipment.id,
      segment_id: segment.id,
      from_stop_id: segment.fromStopId,
      to_stop_id: segment.toStopId,
      mode: segment.transportationMode,
      emissions_distance_value: segment.emissions && segment.emissions.distance ? segment.emissions.distance.value || null : null,
      emissions_distance_unit: segment.emissions && segment.emissions.distance ? segment.emissions.distance.unit || null : null,
      emissions_co2_intensity_value: segment.emissions && segment.emissions.co2EmissionIntensity ? segment.emissions.co2EmissionIntensity.value || null : null,
      emissions_co2_intensity_unit: segment.emissions && segment.emissions.co2EmissionIntensity ? segment.emissions.co2EmissionIntensity.unit || null : null,
      emissions_total_value: segment.emissions && segment.emissions.totalCO2Emissions ? segment.emissions.totalCO2Emissions.value || null : null, 
      emissions_total_unit: segment.emissions && segment.emissions.totalCO2Emissions ? segment.emissions.totalCO2Emissions.unit || null : null
    };

    for (const identifierType of sourceIdentifierTypes) {
      s[identifierType] = null;
    }

    if( segment.identifiers && Array.isArray(segment.identifiers)) {
      for (const identifier of segment.identifiers) {
        s[identifier.type.toLowerCase()] = identifier.value;
      }
    }

    routeSegments.push(s);
  }

  return routeSegments;
}

/**
 * Processes the identifiers of a shipment. Parses the identifiers and writes them to a Parquet file. 
 * Once the file has been sent to Celonis this file is deleted.
 * 
 * @param {Object} shipment - The shipment object.
 * @returns {Promise<void>} - A promise that resolves when the identifiers are processed.
 */
async function processRouteSegements(shipment) {
  var segments = await parseRouteSegments(shipment);
  var fileName = await writeParquetFile(segments, shipment.id, 'route_segments', SHIPMENT_ROUTE_SEGMENT_SCHEME);
  if(checkFileExistsSync(fileName)) {
    var response = await sendToCelonis(keys, fileName, 'shipment_route_segments');
    var id = null;
    if(response && response.data) {
      id = response.data.id;
    }
    await deleteParquetFile(fileName);
    return id;  
  } else {
    logger.warn(`File ${fileName} does not exist`);
    return -1;
  }
}

module.exports = {
  processRouteSegements
};