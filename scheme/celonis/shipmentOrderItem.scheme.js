const parquet = require('parquetjs');

/**
 * Parquet schema for the shipment order item.
 *
 * @type {parquet.ParquetSchema}
 */
const SHIPMENT_ORDER_ITEM_SCHEME = new parquet.ParquetSchema({
  shipment_id: { type: 'UTF8' },
  order_id: { type: 'UTF8' },
  order_item_id: { type: 'UTF8' },
  consume_by_date: { type: 'UTF8', optional: true },
  description: { type: 'UTF8', optional: true },
  cubic_length: { type: 'FLOAT', optional: true },
  cubic_width: { type: 'FLOAT', optional: true },
  cubic_height: { type: 'FLOAT', optional: true },
  length_unit: { type: 'UTF8', optional: true },
  package_type: { type: 'UTF8', optional: true },
  quantity: { type: 'FLOAT', optional: true },
  weight: { type: 'FLOAT', optional: true },
  weigh_unit: { type: 'UTF8', optional: true },
  department_id: { type: 'UTF8', optional: true },
  sub_department_id: { type: 'UTF8', optional: true },
  category_id: { type: 'UTF8', optional: true },
  group_id: { type: 'UTF8', optional: true },
  family_id: { type: 'UTF8', optional: true },
  gender_id: { type: 'UTF8', optional: true },
  vendor_id: { type: 'UTF8', optional: true },
  manufacturer_id: { type: 'UTF8', optional: true },
  promotion_id: { type: 'UTF8', optional: true },
  sector_id: { type: 'UTF8', optional: true },
  division_id: { type: 'UTF8', optional: true },
  class_id: { type: 'UTF8', optional: true },
  sub_class_id: { type: 'UTF8', optional: true },
  code_id: { type: 'UTF8', optional: true },
  season_id: { type: 'UTF8', optional: true },
  hazmat_id: { type: 'UTF8', optional: true },
  hazmat_shipping_name: { type: 'UTF8', optional: true },
  hazmat_class: { type: 'UTF8', optional: true },
  hazmat_packing_group: { type: 'UTF8', optional: true },
  manufactured_date: { type: 'UTF8', optional: true },
  packaged_date: { type: 'UTF8', optional: true },
  per_unit_cost_currency: { type: 'UTF8', optional: true },
  per_unit_cost_amount: { type: 'FLOAT', optional: true },
  per_unit_retail_value_currency: { type: 'UTF8', optional: true },
  per_unit_retail_value_amount: { type: 'FLOAT', optional: true },
  perishable: { type: 'UTF8', optional: true },
  promotional_start_date: { type: 'UTF8', optional: true },
  promotional_end_date: { type: 'UTF8', optional: true },
  sell_by_date: { type: 'UTF8', optional: true },
  serial_number: { type: 'UTF8', optional: true },
  stock_keeping_unit: { type: 'UTF8', optional: true },
  taxable: { type: 'UTF8', optional: true },
  universal_product_code: { type: 'UTF8', optional: true }
});

/**
 * Array of keys for a shipment order item.
 * @type {string[]}
 */
const SHIPMENT_ORDER_ITEM_KEYS = [
  "shipment_id",
  "order_id",
  "order_item_id"
];

module.exports = {
  SHIPMENT_ORDER_ITEM_SCHEME,
  SHIPMENT_ORDER_ITEM_KEYS
};