const parquet = require('parquetjs');

/**
 * Parquet schema for event details.
 *
 * @type {parquet.ParquetSchema}
 */
const SHIPMENT_EVENT_DETAIL_SCHEME = new parquet.ParquetSchema({
  shipment_id: { type: 'UTF8' },
  stop_id: { type: 'UTF8', optional: true },
  route_segment_id: { type: 'UTF8', optional: true },
  type: { type: 'UTF8' },
  date_time: { type: 'UTF8' },
  end_date_time: { type: 'UTF8', optional: true },
  last_modified_date_time: { type: 'UTF8', optional: true },
  source: { type: 'UTF8' },
  selected: { type: 'BOOLEAN', optional: true },
  sequence: { type: 'INT64', optional: true },
  air_waybill: { type: 'UTF8', optional: true },
  bill_of_lading: { type: 'UTF8', optional: true },
  house_bill_of_lading: { type: 'UTF8', optional: true },
  booking_number: { type: 'UTF8', optional: true },
  carrier_iata: { type: 'UTF8', optional: true },
  carrier_icao: { type: 'UTF8', optional: true },
  carrier_name: { type: 'UTF8', optional: true },
  carrier_scac: { type: 'UTF8', optional: true },
  ffw_scac: { type: 'UTF8', optional: true },
  container_id: { type: 'UTF8', optional: true },
  customer_reference: { type: 'UTF8', optional: true },
  delivery_number: { type: 'UTF8', optional: true },
  external: { type: 'UTF8', optional: true },
  flight_number: { type: 'UTF8', optional: true },
  order: { type: 'UTF8', optional: true },
  pickup: { type: 'UTF8', optional: true },
  pro: { type: 'UTF8', optional: true },
  purchase_order: { type: 'UTF8', optional: true },
  rail_car_id: { type: 'UTF8', optional: true },
  rail_waybill: { type: 'UTF8', optional: true },
  tracking_number: { type: 'UTF8', optional: true },
  trailer_id: { type: 'UTF8', optional: true },
  unknown: { type: 'UTF8', optional: true },
  vessel_imo: { type: 'UTF8', optional: true },
  vessel_name: { type: 'UTF8', optional: true },
  waybill: { type: 'UTF8', optional: true },
  vessel_call_sign: { type: 'UTF8', optional: true },
  vessel_mmsi: { type: 'UTF8', optional: true },
  carrier_us_dot_number: { type: 'UTF8', optional: true },
  carrier_mc_number: { type: 'UTF8', optional: true },
  subscription_id: { type: 'UTF8', optional: true },
  house_air_waybill: { type: 'UTF8', optional: true },
  sales_order: { type: 'UTF8', optional: true },
  warehouse_movement_order: { type: 'UTF8', optional: true },
  advanced_shipment_notice: { type: 'UTF8', optional: true },
  driver_mobile_phone_number: { type: 'UTF8', optional: true },
  vehicle_id: { type: 'UTF8', optional: true },
  license_plate: { type: 'UTF8', optional: true },
  sensitech_device_id: { type: 'UTF8', optional: true },
  emerson_device_id: { type: 'UTF8', optional: true },
  tive_device_id: { type: 'UTF8', optional: true },
  zillion_device_id: { type: 'UTF8', optional: true },
  voyage_number: { type: 'UTF8', optional: true },
  carrier_master_id: { type: 'UTF8', optional: true },
  carrier_nmc_id: { type: 'UTF8', optional: true },
  container_type: { type: 'UTF8', optional: true },
  train_number: { type: 'UTF8', optional: true },
  wagon_id: { type: 'UTF8', optional: true },
  capacity_provider_account_group: { type: 'UTF8', optional: true },
  capacity_provider_account_code: { type: 'UTF8', optional: true },
  serial_number: { type: 'UTF8', optional: true },
  vehicle_identification_number: { type: 'UTF8', optional: true },
  reference_number: { type: 'UTF8', optional: true },
  container_pin: { type: 'UTF8', optional: true }
});

const SHIPMENT_EVENT_DETAIL_KEYS = [
  "shipment_id",
  "type",
  "date_time",
];

module.exports = {
  SHIPMENT_EVENT_DETAIL_SCHEME,
  SHIPMENT_EVENT_DETAIL_KEYS
};
