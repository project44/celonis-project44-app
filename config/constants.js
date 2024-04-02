const stopIdentifierTypes = [ 'airport_iata', 'airport_icao', 'external', 'locode', 'name', 'port_un_locode', 'facility_id', 'rail_splc', 'rail_uic', 'rail_eu_plc', 'unknown'];

const sourceIdentifierTypes = ['air_waybill', 'bill_of_lading', 'house_bill_of_lading', 'booking_number', 'carrier_iata', 'carrier_icao', 'carrier_name', 'carrier_scac', 'ffw_scac', 'container_id', 'customer_reference', 'delivery_number', 'external', 'flight_number', 'order', 'pickup', 'pro', 'purchase_order', 'rail_car_id', 'rail_waybill', 'tracking_number', 'trailer_id', 'unknown', 'vessel_imo', 'vessel_name', 'waybill', 'vessel_call_sign', 'vessel_mmsi', 'carrier_us_dot_number', 'carrier_mc_number', 'subscription_id', 'house_air_waybill', 'sales_order', 'warehouse_movement_order', 'advanced_shipment_notice', 'driver_mobile_phone_number', 'vehicle_id', 'license_plate', 'sensitech_device_id', 'emerson_device_id', 'tive_device_id', 'zillion_device_id', 'voyage_number', 'carrier_master_id', 'carrier_nmc_id', 'container_type', 'train_number', 'wagon_id', 'capacity_provider_account_group', 'capacity_provider_account_code', 'serial_number', 'vehicle_identification_number', 'reference_number', 'container_pin'];

module.exports = {
  stopIdentifierTypes,
  sourceIdentifierTypes
};