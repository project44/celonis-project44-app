const parquet = require('parquetjs');

/**
 * Parquet schema for events.
 *
 * @typedef {Object} EventSchema
 * @property {string} shipment_id - The ID of the shipment.
 * @property {string} type - The type of the event.
 * @property {string} [date_time] - The date and time of the event (optional).
 * @property {string} [received_date_time] - The date and time the event was received (optional).
 * @property {string} [description] - The description of the event (optional).
 * @property {string} [stop_id] - The ID of the stop associated with the event (optional).
 * @property {string} [route_segment_id] - The ID of the route segment associated with the event (optional).
 * @property {string} [estimate_date_time] - The estimated date and time of the event (optional).
 * @property {string} [estimate_last_calculated_date_time] - The date and time when the estimate was last calculated (optional).
 * @property {string} [planned_date_time] - The planned date and time of the event (optional).
 * @property {string} [planned_end_date_time] - The planned end date and time of the event (optional).
 */
const SHIPMENT_EVENT_SCHEME = new parquet.ParquetSchema({
  shipment_id: { type: 'UTF8' },
  type: { type: 'UTF8' },
  date_time: { type: 'UTF8', optional: true },
  received_date_time: { type: 'UTF8', optional: true },
  description: { type: 'UTF8', optional: true },
  stop_id: { type: 'UTF8', optional: true },
  route_segment_id: { type: 'UTF8', optional: true },
  estimate_date_time: { type: 'UTF8', optional: true },
  estimate_last_calculated_date_time: { type: 'UTF8', optional: true },
  planned_date_time: { type: 'UTF8', optional: true },
  planned_end_date_time: { type: 'UTF8', optional: true }
});

module.exports = {
  SHIPMENT_EVENT_SCHEME
};