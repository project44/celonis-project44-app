const { writeParquetFile,  deleteParquetFile } = require('../utils/parquet.js');
const { SHIPMENT_ORDER_SCHEME } = require('../scheme/celonis/shipmentOrder.scheme.js');
const { logger } = require('../utils/logger.js');
const { getOrders }  = require('../services/p44.orders.service.js');

async function parseOrders(orders, shipment_id) {
  const payload = [];

  for(const order of orders) {
    var o = {
      shipment_id: shipment_id,
      order_id: order.id,
      customer_order_id: order.orderIdentifier || null
    }

    logger.info(`Processing Order ${order.id} for Shipment ${shipment_id}`);

    o = Object.assign(o, parseAdditionalIdentifiers(order.additionalIdentifiers));

    o.freight_terms_ownership_type = order.freightTermsOwnershipType || null;
    o.freight_terms_payment_type = order.freightTermsPaymentType || null;
    o.launch_date = order.launchDate || null;
    o.order_id_authority = order.orderIdAuthority || null;
    o.order_submission_date = order.orderSubmissionDate || null;
    o.order_type = order.orderType || null;
    o.status_code = order.statusCode || null;
    o.status_code_date = order.statusCodeDate || null;
    o.subject_to_change = order.subjectToChange || null;
    o.supplier_ready_date_start = order.supplierReadyDate && order.supplierReadyDateTimeWindow && order.supplierReadyDateTimeWindow.startDateTime ?  order.supplierReadyDateTimeWindow.startDateTime || null : null;
    o.supplier_ready_date_end = order.supplierReadyDate && order.supplierReadyDateTimeWindow && order.supplierReadyDateTimeWindow.endDateTime ?  order.supplierReadyDateTimeWindow.endDateTime : null;
    o.total_cost_currency = order.totalCost && order.totalCost.currency ? order.totalCost.currency : null;
    o.total_cost_amount = order.totalCost && order.totalCost.amount ? order.totalCost.amount : null;
    o.total_retail_value_currency = order.totalRetailValue && order.totalRetailValue.currency ? order.totalRetailValue.currency : null;
    o.total_retail_value_amount = order.totalRetailValue && order.totalRetailValue.amount ? order.totalRetailValue.amount : null;
    o.health_arrival_status_duration_unit = order.derivedOrderHealth && order.derivedOrderHealth.arrivalStatus && order.derivedOrderHealth.arrivalStatus.duration && order.derivedOrderHealth.arrivalStatus.duration.unit ? order.derivedOrderHealth.arrivalStatus.duration.unit : null;
    o.health_arrival_status_duration_value = order.derivedOrderHealth && order.derivedOrderHealth.arrivalStatus && order.derivedOrderHealth.arrivalStatus.duration && order.derivedOrderHealth.arrivalStatus.duration.value ? order.derivedOrderHealth.arrivalStatus.duration.value : null;
    o.health_arrival_eta = order.derivedOrderHealth && order.derivedOrderHealth.estimatedTimeOfArrival ? order.derivedOrderHealth.estimatedTimeOfArrival : null;

    o.vendor_id = order.vendorLocation && order.vendorLocation.id ? order.vendorLocation.id : null;
    o.vendor_supplied_id = order.vendorLocation && order.vendorLocation.vendorSuppliedId ? order.vendorLocation.vendorSuppliedId : null;
    o.vendor_location_name = order.vendorLocation && order.vendorLocation.name ? order.vendorLocation.name : null;
    o.vendor_location_address_1 = order.vendorLocation && order.vendorLocation.address && order.vendorLocation.address.lines && order.vendorLocation.address.addressLines[0] ? order.vendorLocation.address.addressLines[0] : null;
    o.vendor_location_address_2 = order.vendorLocation && order.vendorLocation.address && order.vendorLocation.address.lines && order.vendorLocation.address.addressLines[1] ? order.vendorLocation.address.addressLines[1] : null;
    o.vendor_location_address_3 = order.vendorLocation && order.vendorLocation.address && order.vendorLocation.address.lines && order.vendorLocation.address.addressLines[2] ? order.vendorLocation.address.addressLines[2] : null;
    o.vendor_location_state = order.vendorLocation && order.vendorLocation.address && order.vendorLocation.address.state ? order.vendorLocation.address.state : null;
    o.vendor_location_city = order.vendorLocation && order.vendorLocation.address && order.vendorLocation.address.city ? order.vendorLocation.address.city : null;  
    o.vendor_location_postal_code = order.vendorLocation && order.vendorLocation.address && order.vendorLocation.address.postalCode ? order.vendorLocation.address.postalCode : null;
    o.vendor_location_country = order.vendorLocation && order.vendorLocation.address && order.vendorLocation.address.country ? order.vendorLocation.address.country : null;
    o.vendor_company_name = order.vendorLocation && order.vendorLocation.contact && order.vendorLocation.contact.companyName ? order.vendorLocation.contact.companyName : null;
    o.vendor_contact_name = order.vendorLocation && order.vendorLocation.contact && order.vendorLocation.contact.contactName ? order.vendorLocation.contact.contactName : null;
    o.vendor_contact_type = order.vendorLocation && order.vendorLocation.contact && order.vendorLocation.contact.contactType ? order.vendorLocation.contact.contactType : null;
    o.vendor_primary_contact_phone_country_code = order.vendorLocation && order.vendorLocation.contact && order.vendorLocation.contact.phoneNumberCountryCode ? order.vendorLocation.contact.phoneNumberCountryCode : null;
    o.vendor_primary_contact_phone = order.vendorLocation && order.vendorLocation.contact && order.vendorLocation.contact.phoneNumber ? order.vendorLocation.contact.phoneNumber : null;
    o.vendor_alt_contact_phone_country_code = order.vendorLocation && order.vendorLocation.contact  && order.vendorLocation.contact.phoneNumber2CountryCode ? order.vendorLocation.contact.phoneNumber2CountryCode : null;
    o.vendor_alt_contact_phone = order.vendorLocation && order.vendorLocation.contact && order.vendorLocation.contact.phoneNumber2 ? order.vendorLocation.contact.phoneNumber2 : null;
    o.vendor_fax_contact_phone_country_code = order.vendorLocation && order.vendorLocation.contact && order.vendorLocation.contact.faxNumberCountryCode ? order.vendorLocation.contact.faxNumberCountryCode : null;
    o.vendor_fax_contact_phone = order.vendorLocation && order.vendorLocation.contact && order.vendorLocation.contact.faxNumber ? order.vendorLocation.contact.faxNumber : null;
    o.vendor_contact_email = order.vendorLocation && order.vendorLocation.contact && order.vendorLocation.contact.email ? order.vendorLocation.contact.email : null;

    o.origin_id = order.originLocation && order.originLocation.id ? order.originLocation.id : null;
    o.origin_supplied_id = order.originLocation && order.originLocation.originSuppliedId ? order.originLocation.originSuppliedId : null;
    o.origin_location_name = order.originLocation && order.originLocation.name ? order.originLocation.name : null;
    o.origin_location_address_1 = order.originLocation && order.originLocation.address && order.originLocation.address.lines && order.originLocation.address.addressLines[0] ? order.originLocation.address.addressLines[0] : null;
    o.origin_location_address_2 = order.originLocation && order.originLocation.address && order.originLocation.address.lines && order.originLocation.address.addressLines[1] ? order.originLocation.address.addressLines[1] : null;
    o.origin_location_address_3 = order.originLocation && order.originLocation.address && order.originLocation.address.lines && order.originLocation.address.addressLines[2] ? order.originLocation.address.addressLines[2] : null;
    o.origin_location_state = order.originLocation && order.originLocation.address && order.originLocation.address.state ? order.originLocation.address.state : null;
    o.origin_location_city = order.originLocation && order.originLocation.address && order.originLocation.address.city ? order.originLocation.address.city : null;  
    o.origin_location_postal_code = order.originLocation && order.originLocation.address && order.originLocation.address.postalCode ? order.originLocation.address.postalCode : null;
    o.origin_location_country = order.originLocation && order.originLocation.address && order.originLocation.address.country ? order.originLocation.address.country : null;
    o.origin_company_name = order.originLocation && order.originLocation.contact && order.originLocation.contact.companyName ? order.originLocation.contact.companyName : null;
    o.origin_contact_name = order.originLocation && order.originLocation.contact && order.originLocation.contact.contactName ? order.originLocation.contact.contactName : null;
    o.origin_contact_type = order.originLocation && order.originLocation.contact && order.originLocation.contact.contactType ? order.originLocation.contact.contactType : null;
    o.origin_primary_contact_phone_country_code = order.originLocation && order.originLocation.contact && order.originLocation.contact.phoneNumberCountryCode ? order.originLocation.contact.phoneNumberCountryCode : null;
    o.origin_primary_contact_phone = order.originLocation && order.originLocation.contact && order.originLocation.contact.phoneNumber ? order.originLocation.contact.phoneNumber : null;
    o.origin_alt_contact_phone_country_code = order.originLocation && order.originLocation.contact  && order.originLocation.contact.phoneNumber2CountryCode ? order.originLocation.contact.phoneNumber2CountryCode : null;
    o.origin_alt_contact_phone = order.originLocation && order.originLocation.contact && order.originLocation.contact.phoneNumber2 ? order.originLocation.contact.phoneNumber2 : null;
    o.origin_fax_contact_phone_country_code = order.originLocation && order.originLocation.contact && order.originLocation.contact.faxNumberCountryCode ? order.originLocation.contact.faxNumberCountryCode : null;
    o.origin_fax_contact_phone = order.originLocation && order.originLocation.contact && order.originLocation.contact.faxNumber ? order.originLocation.contact.faxNumber : null;
    o.origin_contact_email = order.originLocation && order.originLocation.contact && order.originLocation.contact.email ? order.originLocation.contact.email : null;
  
    o.destination_id = order.destinationLocation && order.destinationLocation.id ? order.destinationLocation.id : null;
    o.destination_supplied_id = order.destinationLocation && order.destinationLocation.destinationSuppliedId ? order.destinationLocation.destinationSuppliedId : null;
    o.destination_location_name = order.destinationLocation && order.destinationLocation.name ? order.destinationLocation.name : null;
    o.destination_location_address_1 = order.destinationLocation && order.destinationLocation.address && order.destinationLocation.address.lines && order.destinationLocation.address.addressLines[0] ? order.destinationLocation.address.addressLines[0] : null;
    o.destination_location_address_2 = order.destinationLocation && order.destinationLocation.address && order.destinationLocation.address.lines && order.destinationLocation.address.addressLines[1] ? order.destinationLocation.address.addressLines[1] : null;
    o.destination_location_address_3 = order.destinationLocation && order.destinationLocation.address && order.destinationLocation.address.lines && order.destinationLocation.address.addressLines[2] ? order.destinationLocation.address.addressLines[2] : null;
    o.destination_location_state = order.destinationLocation && order.destinationLocation.address && order.destinationLocation.address.state ? order.destinationLocation.address.state : null;
    o.destination_location_city = order.destinationLocation && order.destinationLocation.address && order.destinationLocation.address.city ? order.destinationLocation.address.city : null;  
    o.destination_location_postal_code = order.destinationLocation && order.destinationLocation.address && order.destinationLocation.address.postalCode ? order.destinationLocation.address.postalCode : null;
    o.destination_location_country = order.destinationLocation && order.destinationLocation.address && order.destinationLocation.address.country ? order.destinationLocation.address.country : null;
    o.destination_company_name = order.destinationLocation && order.destinationLocation.contact && order.destinationLocation.contact.companyName ? order.destinationLocation.contact.companyName : null;
    o.destination_contact_name = order.destinationLocation && order.destinationLocation.contact && order.destinationLocation.contact.contactName ? order.destinationLocation.contact.contactName : null;
    o.destination_contact_type = order.destinationLocation && order.destinationLocation.contact && order.destinationLocation.contact.contactType ? order.destinationLocation.contact.contactType : null;
    o.destination_primary_contact_phone_country_code = order.destinationLocation && order.destinationLocation.contact && order.destinationLocation.contact.phoneNumberCountryCode ? order.destinationLocation.contact.phoneNumberCountryCode : null;
    o.destination_primary_contact_phone = order.destinationLocation && order.destinationLocation.contact && order.destinationLocation.contact.phoneNumber ? order.destinationLocation.contact.phoneNumber : null;
    o.destination_alt_contact_phone_country_code = order.destinationLocation && order.destinationLocation.contact  && order.destinationLocation.contact.phoneNumber2CountryCode ? order.destinationLocation.contact.phoneNumber2CountryCode : null;
    o.destination_alt_contact_phone = order.destinationLocation && order.destinationLocation.contact && order.destinationLocation.contact.phoneNumber2 ? order.destinationLocation.contact.phoneNumber2 : null;
    o.destination_fax_contact_phone_country_code = order.destinationLocation && order.destinationLocation.contact && order.destinationLocation.contact.faxNumberCountryCode ? order.destinationLocation.contact.faxNumberCountryCode : null;
    o.destination_fax_contact_phone = order.destinationLocation && order.destinationLocation.contact && order.destinationLocation.contact.faxNumber ? order.destinationLocation.contact.faxNumber : null;
    o.destination_contact_email = order.destinationLocation && order.destinationLocation.contact && order.destinationLocation.contact.email ? order.destinationLocation.contact.email : null;


    o.bill_to_id = order.billToLocation && order.billToLocation.id ? order.billToLocation.id : null;
    o.bill_to_supplied_id = order.billToLocation && order.billToLocation.vendorSuppliedId ? order.billToLocation.vendorSuppliedId : null;
    o.bill_to_location_name = order.billToLocation && order.billToLocation.name ? order.billToLocation.name : null;
    o.bill_to_location_address_1 = order.billToLocation && order.billToLocation.address && order.billToLocation.address.lines && order.billToLocation.address.addressLines[0] ? order.billToLocation.address.addressLines[0] : null;
    o.bill_to_location_address_2 = order.billToLocation && order.billToLocation.address && order.billToLocation.address.lines && order.billToLocation.address.addressLines[1] ? order.billToLocation.address.addressLines[1] : null;
    o.bill_to_location_address_3 = order.billToLocation && order.billToLocation.address && order.billToLocation.address.lines && order.billToLocation.address.addressLines[2] ? order.billToLocation.address.addressLines[2] : null;
    o.bill_to_location_state = order.billToLocation && order.billToLocation.address && order.billToLocation.address.state ? order.billToLocation.address.state : null;
    o.bill_to_location_city = order.billToLocation && order.billToLocation.address && order.billToLocation.address.city ? order.billToLocation.address.city : null;  
    o.bill_to_location_postal_code = order.billToLocation && order.billToLocation.address && order.billToLocation.address.postalCode ? order.billToLocation.address.postalCode : null;
    o.bill_to_location_country = order.billToLocation && order.billToLocation.address && order.billToLocation.address.country ? order.billToLocation.address.country : null;
    o.bill_to_company_name = order.billToLocation && order.billToLocation.contact && order.billToLocation.contact.companyName ? order.billToLocation.contact.companyName : null;
    o.bill_to_contact_name = order.billToLocation && order.billToLocation.contact && order.billToLocation.contact.contactName ? order.billToLocation.contact.contactName : null;
    o.bill_to_contact_type = order.billToLocation && order.billToLocation.contact && order.billToLocation.contact.contactType ? order.billToLocation.contact.contactType : null;
    o.bill_to_primary_contact_phone_country_code = order.billToLocation && order.billToLocation.contact && order.billToLocation.contact.phoneNumberCountryCode ? order.billToLocation.contact.phoneNumberCountryCode : null;
    o.bill_to_primary_contact_phone = order.billToLocation && order.billToLocation.contact && order.billToLocation.contact.phoneNumber ? order.billToLocation.contact.phoneNumber : null;
    o.bill_to_alt_contact_phone_country_code = order.billToLocation && order.billToLocation.contact  && order.billToLocation.contact.phoneNumber2CountryCode ? order.billToLocation.contact.phoneNumber2CountryCode : null;
    o.bill_to_alt_contact_phone = order.billToLocation && order.billToLocation.contact && order.billToLocation.contact.phoneNumber2 ? order.billToLocation.contact.phoneNumber2 : null;
    o.bill_to_fax_contact_phone_country_code = order.billToLocation && order.billToLocation.contact && order.billToLocation.contact.faxNumberCountryCode ? order.billToLocation.contact.faxNumberCountryCode : null;
    o.bill_to_fax_contact_phone = order.vendorLocation && order.billToLocation.contact && order.billToLocation.contact.faxNumber ? order.billToLocation.contact.faxNumber : null;
    o.bill_to_contact_email = order.billToLocation && order.billToLocation.contact && order.billToLocation.contact.email ? order.billToLocation.contact.email : null;
    payload.push(o);
  }

  return payload;
}

async function processOrders(shipment) {
  var orders = await getOrders(shipment.id);
  var parsedOrders = await parseOrders(orders, shipment.id);  
  if(orders == null || orders.length == 0) {
    logger.error(`No Orders found for Shipment ${shipment.id}`);
    return;
  }
  var fileName = await writeParquetFile(parsedOrders, 'shipment_orders', SHIPMENT_ORDER_SCHEME, shipment.id);
  logger.info(`File ${fileName} Created.`);
}

function parseAdditionalIdentifiers(data) {
  if(data == null || data.length == 0) {
    return {};
  }
  return data.reduce((acc, curr) => {
    acc[`order_${curr.type.toLowerCase()}_id`] = curr.value;
    return acc;
  }, {});
}

module.exports = {
  processOrders
}