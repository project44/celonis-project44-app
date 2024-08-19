const httpStatus = require('http-status');  

const { PROJECT44_INCLUDE_ORDERS, PROJECT44_INCLUDE_ORDER_ITEMS } = require('../../config/config.js');
const { getOrders } = require('../../services/p44.orders.service.js');
const { getOrderItems } = require('../../services/p44.orderItems.service.js');
// const mockItems = require('../../mockData/orderItems.js');
// const mockOrders  = require('../../mockData/orders.js');
const { writeJsonParquetFile, deleteParquetFile } = require('../../utils/parquet.js')
const {logger} = require('../../utils/logger.js');
const fs = require('fs');
const path = require('path');
const { v5: uuidv5 } = require('uuid');
const { uploadToS3 } = require('../../services/celonis.service.js');

/**
 * Handles the receipt of a webhook from project44.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
const receivePost = async (req, res, next) => {
  var response = {};
  response.message = 'Received webhook from project44';
  response.status = httpStatus.ACCEPTED;
  res.status(httpStatus.ACCEPTED).send(response);
  var shipmentPayload = await parseAndProcessShipment(req, res, next);

  // Write the shipment data to a parquet file
  logger.info(`Writing shipment data to parquet file for shipment: ${shipmentPayload.shipment.id} }`);
  var payload = [];
  payload.push(shipmentPayload);
  var filename = await writeJsonParquetFile(payload);
  logger.info(`Wrote file: ${filename}`);

  var celonisApp = req.headers['x-celonis-app'];
  var celonisConnectId = req.headers['x-celonis-connection-id'];
  var celonisAccessKey = req.headers['x-celonis-access-key'];
  var celonisAccessSecret = req.headers['x-celonis-access-secret'];
  var celonisAwsRegion = req.headers['x-celonis-aws-region'];
  var celonisUrlRegion = req.headers['x-celonis-url-region'];
  var celonisBucketId = req.headers['x-celonis-bucket-id'];

  logger.info(`============================ HEADERS ============================`);
  console.log(req.headers);
  logger.info(`============================         ============================`);
  
  await uploadToS3(celonisApp, filename, celonisConnectId, celonisAccessKey, celonisAccessSecret, celonisAwsRegion, celonisUrlRegion, celonisBucketId, 'shipment');

  await deleteParquetFile(filename);
}

async function parseAndProcessShipment(req, res, next) {
  console.log("webhook received");
  // Massage the payload for any arrays such as with reference keys
  req.body = await enhanceShipmentData(req, res, next);
  
  // Add any orders and order items to the payload (massaging the payload as needed)
  if(PROJECT44_INCLUDE_ORDERS) {
    var orders = await getOrders(req.body.shipment.id);
    // var orders = mockOrders;
    if(orders) {
      // Transform Orders
      orders = await enhanceOrderData(orders);

      for(var i = 0; i < orders.length; i++) {
        var order = orders[i];
        logger.info(`Processing order: ${order.id}`);
        if(order.id) {
          if(PROJECT44_INCLUDE_ORDER_ITEMS) {
            var orderItems = await getOrderItems(order.id);
            // var orderItems = mockItems.getOrderItemsByOrderId(order.id);
            if(orderItems) {
              // Transform Order Items
              orderItems = await enhanceOrderItemData(orderItems);
              orders[i].orderItems = orderItems;
            }
          }  
        }
      }

      req.body.orders = orders;
    }
  }

  // Create the parquet file
  // Post parquet file to Celonis AWS S3 bucket


  // logger.info(JSON.stringify(req.body));

  return req.body;
}

/**
 * Enhances the shipment data by transforming its attributes, stops, events, and states.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} - The enhanced shipment data.
 */
async function enhanceShipmentData(req, res, next) {
  console.log("transforming shipment data");
  // Hack to create missing UUIDs
  var stopIdNamespace = "eb3509c0-195f-4371-a72f-ad4c53fc0145";
  var routeSegmentIdNamespace = "323a8c0c-657f-400e-af53-64cdd8747441";
// Transform the attributes of the shipment data
  incomingAttributes = req.body.shipment.attributes;
  outgoingAttributes = [];
  if(incomingAttributes) {
    for (var i = 0; i < incomingAttributes.length; i++) {
      var attribute = {};
      attribute.name = incomingAttributes[i].name;
      for(var j = 0; j < incomingAttributes[i].values.length; j++) {
        attribute.value = incomingAttributes[i].values[j];
        outgoingAttributes.push(attribute);
      };
    }  
  }
  req.body.shipment.attributes = outgoingAttributes;

  // Transform the stops of the shipment data
  if( req.body.shipment.routeInfo && req.body.shipment.routeInfo.stops ) {
    for(var i = 0; i < req.body.shipment.routeInfo.stops.length; i++) {
      var stop = req.body.shipment.routeInfo.stops[i];
      if(stop.location && stop.location.address ) {
        if(stop.location.address.addressLines) {
          req.body.shipment.routeInfo.stops[i].location.address.addressLine1 = stop.location.address.addressLines.length >= 1 ? stop.location.address.addressLines[0] : '';
          req.body.shipment.routeInfo.stops[i].location.address.addressLine2 = stop.location.address.addressLines.length >= 2 ? stop.location.address.addressLines[1] : '';
          req.body.shipment.routeInfo.stops[i].location.address.addressLine3 = stop.location.address.addressLines.length >= 3 ? stop.location.address.addressLines[2] : '';
        } else {
          req.body.shipment.routeInfo.stops[i].location.address.addressLine1 =  '';
          req.body.shipment.routeInfo.stops[i].location.address.addressLine2 =  '';
          req.body.shipment.routeInfo.stops[i].location.address.addressLine3 =  '';  
        }
        delete req.body.shipment.routeInfo.stops[i].location.address.addressLines;
      }
    }
  }

  // Transform events - Generate a stop id and route id for each event if they are not already present
  if(req.body.events) {
    for(var i = 0; i < req.body.events.length; i++) {
      var event = req.body.events[i];
      if(!event.dateTime) {
        req.body.events[i].dateTime = event.plannedDateTime || event.estimateDateTime;
      }
      if(!event.stopId) {
        req.body.events[i].stopId = uuidv5(req.body.events[i].dateTime, stopIdNamespace)
      }
      if(!event.routeId) {
        req.body.events[i].routeSegmentId = uuidv5(req.body.events[i].dateTime, routeSegmentIdNamespace)
      }
    }
  }

    // Transform states - Generate a stop id and route id for each state if they are not already present
  if(req.body.states) { 
    for(var i = 0; i < req.body.states.length; i++) {
      var state = req.body.states[i];

      if(!state.stopId) {
        // req.body.states[i].stopId = state.startDateTime;
        req.body.states[i].stopId = uuidv5(state.startDateTime, stopIdNamespace);
      }
      if(!state.routeSegmentId) {
        req.body.states[i].routeSegmentId = uuidv5(state.startDateTime, routeSegmentIdNamespace);
      }
    }
  }

  return req.body;
}

async function enhanceOrderData(orders) {
  for(var i = 0; i < orders.length; i++) {
    var order = orders[i];

    if(order.attributes && order.attributes.length > 0) {
      var attributes = [];
      for(var j = 0; j < order.attributes.length; j++) {
        var attribute = {};
        attribute.name = order.attributes[j].name;
        if(order.attributes[j].values && order.attributes[j].values.length > 0) {
          for(var k = 0; k < order.attributes[j].values.length; k++) {
            attribute.value = order.attributes[j].values[k];
            attributes.push(attribute);
          }
        } else {
          logger.warn(`Order (${i}): ${order.id} - Attribute ${j} has no values`);
        }
      }
      orders[i].attributes = attributes;
    }

    // Consolidate locations into a single location array
    logger.info(`Order (${i}): ${order.id}`);
    order.locations = [];
    if(order.billToLocation) {
      orders[i].locations.push(await enhanceLocation(order.billToLocation, 'BILL_TO'));
      delete order.billToLocation;
    }
    if(order.destinationLocation) {
      orders[i].locations.push(await enhanceLocation(order.destinationLocation, 'DESTINATION'));
      delete order.destinationLocation;
    }
    if(order.originLocation) {
      orders[i].locations.push(await enhanceLocation(order.originLocation, 'ORIGIN'));
      delete order.originLocation;
    }
    if(order.vendorLocation) {
      orders[i].locations.push(await enhanceLocation(order.vendorLocation, 'VENDOR'));
      delete order.vendorLocation;
    }

    delete order.relatedOrderIds;
    delete order.shipmentIds;
  }

  return orders;
}

async function enhanceOrderItemData(orderItems) {
  for(var i = 0; i < orderItems.length; i++) {
    var orderItem = orderItems[i];
    delete orderItem.orderIds;
    delete orderItem.shipmentIds;
  }
  return orderItems;
}

async function enhanceLocation(location, type) {
  if(location && location.address) {
    if(location.address.addressLines) {
      location.address.addressLine1 = location.address.addressLines.length >= 1 ? location.address.addressLines[0] : '';
      location.address.addressLine2 = location.address.addressLines.length >= 2 ? location.address.addressLines[1] : '';
      location.address.addressLine3 = location.address.addressLines.length >= 3 ? location.address.addressLines[2] : '';
      delete location.address.addressLines;
    } else {
      location.address.addressLine1 = '';
      location.address.addressLine2 = '';
      location.address.addressLine3 = '';
    }
  }
  if(!location.additionalContacts) {
    location.additionalContacts = [];
  }
  location.additionalContacts.push(location.contact);
  location.type = type;
  for(var i = 0; i < location.additionalContacts.length; i++) {
    logger.info(JSON.stringify(location.additionalContacts[i]));  
    let namespace = "031ff217-6ea3-44b0-a34f-8e2418f63711";
    let contact = location.additionalContacts[i];
    if(contact) {
      let type = contact.contactType ?? '';
      let email = contact.email ?? '';
      let name = contact.name ?? '';
      let companyName = contact.companyName ?? contact.companyName;
      let data = ( type + email + name + companyName).substring(0, 64);
      logger.info(`Data: ${data}`);
      // let data = (location.additionalContacts[i].contactType + location.additionalContacts[i].email).substring(0, 64);
      location.additionalContacts[i].id = uuidv5(data, namespace);  
    }
  }
  delete location.contact;
  location.contacts = location.additionalContacts;
  delete location.additionalContacts;

  return location;
}

async function packageShipmentAsParquetFile(shipment) {
  var parquet = require('parquetjs');
  var schema = new parquet.ParquetSchema({
    shipmentId: { type: 'UTF8' },
    shipment: { type: 'UTF8' }
  });

  var writer = await parquet.ParquetWriter.openFile(schema, 'data.parquet');
  writer.writeRecord({
    shipmentId: shipment.id,
    shipment: JSON.stringify(shipment)
  });
  writer.close();
}

module.exports = {
  receivePost
}
