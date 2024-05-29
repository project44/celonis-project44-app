const { writeParquetFile,  deleteParquetFile } = require('../utils/parquet.js');
const { SHIPMENT_ORDER_ITEM_SCHEME } = require('../scheme/celonis/shipmentOrderItem.scheme.js');
const { logger } = require('../utils/logger.js');
const { getOrderItems }  = require('../services/p44.orderItems.service.js');
const { getOrders } = require('../services/p44.orders.service.js');

async function parseOrderItems(items, orderId) {
  const payload = [];

  for(const item of items) {
    var i = {
      order_id: orderId,
      order_item_id: item.id
    }

    i.consume_by_date = item.consumeByDateTime || null;
    i.description = item.description || null;

    if(item.inventoryDimensionalWeight && item.inventoryDimensionalWeight != null) {
      if(item.inventoryDimensionalWeight.cubicDimension && item.inventoryDimensionalWeight.cubicDimension != null) {
        i.cubic_length = item.inventoryDimensionalWeight.cubicDimension.length || null;
        i.cubic_width = item.inventoryDimensionalWeight.cubicDimension.width || null;
        i.cubic_height = item.inventoryDimensionalWeight.cubicDimension.height || null;
      } else {
        i.cubic_length = null;
        i.cubic_width = null;
        i.cubic_height = null;
      }
      i.length_unit = item.inventoryDimensionalWeight.lengthUnit || null;
      i.package_type = item.inventoryDimensionalWeight.packageType || null;
      i.quantity = item.inventoryDimensionalWeight.quantity || null;
      i.package_type = item.inventoryDimensionalWeight.packageType || null;
      i.quantity = item.inventoryDimensionalWeight.quantity || null;

      if(item.inventoryDimensionalWeight.weight && item.inventoryDimensionalWeight.weight != null) {
        i.weight = item.inventoryDimensionalWeight.weight.weight || null;
        i.weight_unit = item.inventoryDimensionalWeight.weight.weightUnit || null;
      } else {
        i.weight = null;
        i.weight_unit = null;
      }
    } else {
      i.cubic_length = null;
      i.cubic_width = null;
      i.cubic_height = null;
      i.length_unit = null;
      i.package_type = null;
      i.quantity = null;
      i.package_type = null;
      i.quantity = null;
      i.weight = null;
      i.weight_unit = null;
    }

    if(item.lineItemHazmatDetail && item.lineItemHazmatDetail != null) {
      i.hazmat_id = item.lineItemHazmatDetail.identificationNumber || null;
      i.hazmat_shipping_name = item.lineItemHazmatDetail.properShippingName || null;
      i.hazmat_class = item.lineItemHazmatDetail.hazardClass || null;
      i.hazmat_packing_group = item.lineItemHazmatDetail.packingGroup || null;
    } else {
      i.hazmat_id = null;
      i.hazmat_shipping_name = null;
      i.hazmat_class = null;
      i.hazmat_packing_group = null;
    }

    i.manufactured_date = item.manufacturedDateTime || null;
    i.packaged_date = item.packagedDateTime || null;

    if(item.perUnitCost && item.perUnitCost != null) {
      i.per_unit_cost_currency = item.perUnitCost.currency || null;
      i.per_unit_cost_amount = item.perUnitCost.amount || null;
    } else {
      i.per_unit_cost_currency = null;
      i.per_unit_cost_amount = null;
    }

    if(item.perUnitRetailValue && item.perUnitRetailValue != null) {
      i.per_unit_retail_value_currency = item.perUnitRetailValue.currency || null;
      i.per_unit_retail_value_amount = item.perUnitRetailValue.amount || null;
    } else {
      i.per_unit_retail_value_currency = null;
      i.per_unit_retail_value_amount = null;
    }

    i.perishable = item.perishable || null;

    if(item.promotionalDateTimeWindow && item.promotionalDateTimeWindow != null) {
      i.promotional_start_date = item.promotionalDateTimeWindow.startDateTime || null;
      i.promotional_end_date = item.promotionalDateTimeWindow.endDateTime || null;
    } else {
      i.promotional_start_date = null;
      i.promotional_end_date = null;
    }

    i.sell_by_date = item.sellByDateTime || null;
    i.serial_number = item.serialNumber || null;
    i.stock_keeping_unit = item.stockKeepingUnit || null;
    i.taxable = item.taxable || null;
    i.universal_product_code = item.universalProductCode || null;

    if(item.inventoryIdentifiers != null && item.inventoryIdentifiers.length > 0) {
      i = Object.assign(i, parseAdditionalIdentifiers(item.inventoryIdentifiers));
    }
    payload.push(i);
  }

  return payload;
}

async function processOrderItems(shipment) {
  var orders = await getOrders(shipment.id);
  if(orders == null || orders.length == 0) {
    return;
  }

  for(const order of orders) {
    var orderItems = await getOrderItems( order.id );
    if(orderItems == null || orderItems.length == 0) {
      logger.warn(`No Order Items found for Shipment ${shipment.id} Order: ${order.id}`);
      return;
    }
    var parsedOrderItems = await parseOrderItems(orderItems, order.id, shipment.id);  
    var fileName = await writeParquetFile(parsedOrderItems, 'shipment_order_items', SHIPMENT_ORDER_ITEM_SCHEME, `${shipment.id}_${order.id}`);
    logger.info(`File ${fileName} Created.`);  
  }
}

function parseAdditionalIdentifiers(data) {
  if(data == null || data.length == 0) {
    return {};
  }
  return data.reduce((acc, curr) => {
    acc[`${curr.type.toLowerCase()}_id`] = curr.value;
    return acc;
  }, {});
}

module.exports = {
  processOrderItems
}