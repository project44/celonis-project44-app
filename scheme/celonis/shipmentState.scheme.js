const parquet = require('parquetjs');

/**
 * Represents the Parquet schema for state data.
 *
 * @typedef {Object} StateSchema
 * @property {string} shipment_id - The ID of the shipment.
 * @property {string} type - The type of the state.
 * @property {string} [start_date_time] - The start date and time of the state (optional).
 * @property {string} [end_date_time] - The end date and time of the state (optional).
 * @property {string} stop_id - The ID of the stop.
 * @property {string} [route_segment_id] - The ID of the route segment (optional).
 */
const SHIPMENT_STATE_SCHEME = new parquet.ParquetSchema({
  shipment_id: { type: 'UTF8' },
  type: { type: 'UTF8' },
  start_date_time: { type: 'UTF8', optional: true },
  end_date_time: { type: 'UTF8', optional: true },
  stop_id: { type: 'UTF8', optional: true },
  route_segment_id: { type: 'UTF8', optional: true }
});

module.exports = {
  SHIPMENT_STATE_SCHEME
};