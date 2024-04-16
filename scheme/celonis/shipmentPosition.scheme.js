const parquet = require('parquetjs');

/**
 * Parquet schema for position data.
 *
 * @typedef {Object} PositionSchema
 * @property {Object} shipment_id - The shipment ID.
 * @property {Object} date_time - The date and time.
 * @property {Object} received_date_time - The received date and time (optional).
 * @property {Object} route_segment_id - The route segment ID (optional).
 * @property {Object} lattitude - The latitude.
 * @property {Object} longitude - The longitude.
 */
const SHIPMENT_POSITION_SCHEME = new parquet.ParquetSchema({
  shipment_id: { type: 'UTF8' },
  date_time: { type: 'UTF8' },
  received_date_time: { type: 'UTF8', optional: true },
  route_segment_id: { type: 'UTF8', optional: true },
  lattitude: { type: 'FLOAT' },
  longitude: { type: 'FLOAT' }
});

const SHIPMENT_POSITION_KEYS = [
  "shipment_id",
  "date_time"
];

module.exports = {
  SHIPMENT_POSITION_SCHEME,
  SHIPMENT_POSITION_KEYS
};