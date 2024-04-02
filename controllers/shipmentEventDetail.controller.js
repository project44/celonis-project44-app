const { writeParquetFile,  deleteParquetFile } = require('../utils/parquet.js');
const { SHIPMENT_EVENT_DETAIL_SCHEME } = require('../scheme/celonis/shipmentEventDetail.scheme.js');
const { sourceIdentifierTypes } = require('../config/constants.js');
const { sendToCelonis } = require('../services/celonis.service.js');
const { checkFileExistsSync } = require('../utils/util.js');
const { logger } = require('../utils/logger.js');
const keys = [
  "shipment_id",
  "type",
  "date_time",
];

/**
 * Parses event details and returns an array of parsed details.
 * @param {Array} events - The events to parse.
 * @param {Object} shipment - The shipment object.
 * @returns {Array} - An array of parsed event details.
 */
async function parseEventDetails(events, shipment) {
  if (!events) return null;

  var details = [];

  events.forEach((event) => {
    for(const detail of event.dateTimes) {
      var d = {
        shipment_id: shipment.id,
        stop_id: event.stopId || null,
        route_segment_id: event.routeSegmentId || null,
        type: detail.type || null,
        date_time: detail.dateTime || null,
        end_date_time: detail.endDateTime || null,
        last_modified_date_time: detail.lastModifiedDateTime || null,
        source: detail.source || null,
        selected: detail.selected || false,
        sequence: detail.sequence || 1
      };

      for (const identifierType of sourceIdentifierTypes) {
        d[identifierType] = null;
      }
  
      if (detail.sourceIdentifiers && Array.isArray(detail.sourceIdentifiers)) {
        for (const identifier of detail.sourceIdentifiers) {
          d[identifier.type.toLowerCase()] = identifier.value;
        }
      }
      
      details.push(d);
    }
  });

  return details;
}

/**
 * Processes event details and performs necessary operations.
 *
 * @param {Array} events - The array of events to process.
 * @param {Object} shipment - The shipment object.
 * @returns {Promise<void>} - A promise that resolves when the processing is complete.
 */
async function processEventDetails(events, shipment) {
  var events = await parseEventDetails(events, shipment);
  var fileName = await writeParquetFile(events, shipment.id, 'event_details', SHIPMENT_EVENT_DETAIL_SCHEME);
  if(checkFileExistsSync(fileName)) {
    var response = await sendToCelonis(keys, fileName, 'shipment_event_details');
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
  processEventDetails
};