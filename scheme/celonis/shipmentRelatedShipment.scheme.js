const parquet = require('parquetjs');

/**
 * Parquet schema for related shipments. Primary Key is shipment_id and related_shipment_id.
 *
 * @type {parquet.ParquetSchema}
 */
const SHIPMENT_RELATED_SHIPMENT_SCHEME = new parquet.ParquetSchema({
  shipment_id: { type: 'UTF8' },
  related_shipment_id: { type: 'UTF8' },
  air_waybill: { type: 'UTF8', optional: true },
  bill_of_lading: { type: 'UTF8', optional: true },
  booking_number: { type: 'UTF8', optional: true },
  capacity_provider_account_code: { type: 'UTF8', optional: true },
  capacity_provider_account_group: { type: 'UTF8', optional: true },
  carrier_scac: { type: 'UTF8', optional: true },
  container_id: { type: 'UTF8', optional: true },
  ffw_scac: { type: 'UTF8', optional: true },
  house_air_waybill: { type: 'UTF8', optional: true },
  house_bill_of_lading: { type: 'UTF8', optional: true },
  pickup: { type: 'UTF8', optional: true },
  pro: { type: 'UTF8', optional: true },
  purchase_order: { type: 'UTF8', optional: true },
  rail_car_id: { type: 'UTF8', optional: true },
  reference_number: { type: 'UTF8', optional: true },
  tracking_number: { type: 'UTF8', optional: true },
  trailer_id: { type: 'UTF8', optional: true },
  train_number: { type: 'UTF8', optional: true },
  wagon_id: { type: 'UTF8', optional: true },
  waybill: { type: 'UTF8', optional: true }
});

module.exports = {
  SHIPMENT_RELATED_SHIPMENT_SCHEME
};