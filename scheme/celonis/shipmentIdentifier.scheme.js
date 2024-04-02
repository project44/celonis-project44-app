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

module.exports = {
  SHIPMENT_IDENTIFIER_SCHEME
};