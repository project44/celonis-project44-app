const { writeParquetFile } = require('../utils/parquet.js');
const { SHIPMENT_EVENT_DETAIL_SCHEME } = require('../scheme/celonis/shipmentEventDetail.scheme.js');
const { sourceIdentifierTypes } = require('../config/constants.js');
const { logger } = require('../utils/logger.js');

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
      if(shipment.id && event.stopId && event.routeSegmentId && event.type && detail.type && detail.dateTime && detail.source) {
        var d = {
          shipment_id: shipment.id,
          stop_id: event.stopId,
          route_segment_id: event.routeSegmentId,
          event_type: event.type,
          type: detail.type,
          date_time: detail.dateTime,
          end_date_time: detail.endDateTime || null,
          last_modified_date_time: detail.lastModifiedDateTime || null,
          source: detail.source,
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
  if(events.length === 0) {
    logger.warn(`No event details found for shipment ${shipment.id}.`);
    return;
  }
  var fileName = await writeParquetFile(events, 'shipment_event_details', SHIPMENT_EVENT_DETAIL_SCHEME, shipment.id);
  logger.info(`File ${fileName} Created.`);
}
 
module.exports = {
  processEventDetails
};