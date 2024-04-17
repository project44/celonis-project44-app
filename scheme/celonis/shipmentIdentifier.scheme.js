const parquet = require('parquetjs');

/**
 * Parquet schema for identifiers. Primary key is shipment_id, type, and value.
 *
 * @type {parquet.ParquetSchema}
 */
const SHIPMENT_IDENTIFIER_SCHEME = new parquet.ParquetSchema({
  shipment_id: { type: 'UTF8' },
  type: { type: 'UTF8' },
  value: { type: 'UTF8' },
});

/**
 * Array of keys for the shipment identifier.
 * @type {string[]}
 */
const SHIPMENT_IDENTIFIER_KEYS = [
  "shipment_id",
  "type",
  "value"
];

module.exports = {
  SHIPMENT_IDENTIFIER_SCHEME,
  SHIPMENT_IDENTIFIER_KEYS
};