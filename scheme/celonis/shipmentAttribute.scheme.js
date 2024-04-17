const parquet = require('parquetjs');

/**
 * Parquet schema for shipment attributes.
 *
 * @type {parquet.ParquetSchema}
 */
const SHIPMENT_ATTRIBUTE_SCHEME = new parquet.ParquetSchema({
  shipment_id: { type: 'UTF8' },
  name: { type: 'UTF8' },
  value: { type: 'UTF8' }
});

/**
 * Array of keys for shipment attributes.
 * @type {string[]}
 */
const SHIPMENT_ATTRIBUTE_KEYS = [
  "shipment_id",
  "name",
  "value"
];

module.exports = {
  SHIPMENT_ATTRIBUTE_SCHEME,
  SHIPMENT_ATTRIBUTE_KEYS
};
