const parquet = require('parquetjs');

/**
 * Parquet schema for stops data. Primary key is shipment_id and stop_id.
 *
 * @type {parquet.ParquetSchema}
 */
const SHIPMENT_STOP_SCHEME = new parquet.ParquetSchema({
  shipment_id: { type: 'UTF8' },
  stop_id: { type: 'UTF8' },
  stop_type: { type: 'UTF8', optional: true },
  location_id: { type: 'UTF8', optional: true },
  address_line_1: { type: 'UTF8', optional: true},
  address_line_2: { type: 'UTF8', optional: true },
  address_line_3: { type: 'UTF8', optional: true },
  city: { type: 'UTF8', optional: true },
  state: { type: 'UTF8', optional: true },
  postal_code: { type: 'UTF8', optional: true },
  country: { type: 'UTF8', optional: true },
  time_zone: { type: 'UTF8', optional: true },
  latitude: { type: 'FLOAT', optional: true },
  longitude: { type: 'FLOAT', optional: true },
  airport_iata: { type: 'UTF8', optional: true },
  airport_icao: { type: 'UTF8', optional: true },
  external: { type: 'UTF8', optional: true },
  locode: { type: 'UTF8', optional: true },
  name: { type: 'UTF8', optional: true },
  port_un_locode: { type: 'UTF8', optional: true },
  facility_id: { type: 'UTF8', optional: true },
  rail_splc: { type: 'UTF8', optional: true },
  rail_uic: { type: 'UTF8', optional: true },
  rail_eu_plc: { type: 'UTF8', optional: true },
  unknown: { type: 'UTF8', optional: true }
});

/**
 * Array of keys for the shipment stop.
 * @type {string[]}
 */
const SHIPMENT_STOP_KEYS = [
  "shipment_id",
  "stop_id",
  "stop_type"
];

module.exports = {
  SHIPMENT_STOP_SCHEME,
  SHIPMENT_STOP_KEYS
};