const { logger } = require('../utils/logger.js');
// const { writeParquetFile } = require('../utils/parquet.js');
const { createJob, uploadJobFile, executeJob } = require('../services/celonis.service.js');
const fs = require('fs');
const path = require('path');

const { SHIPMENT_ATTRIBUTE_KEYS } = require('../scheme/celonis/shipmentAttribute.scheme.js');
const { SHIPMENT_EVENT_KEYS } = require('../scheme/celonis/shipmentEvent.scheme.js');
const { SHIPMENT_EVENT_DETAIL_KEYS } = require('../scheme/celonis/shipmentEventDetail.scheme.js');
const { SHIPMENT_IDENTIFIER_KEYS } = require('../scheme/celonis/shipmentIdentifier.scheme.js');
const { SHIPMENT_ORDER_KEYS } = require('../scheme/celonis/shipmentOrder.scheme.js');
const { SHIPMENT_ORDER_ITEM_KEYS } = require('../scheme/celonis/shipmentOrderItem.scheme.js');
const { SHIPMENT_POSITION_KEYS } = require('../scheme/celonis/shipmentPosition.scheme.js');
const { SHIPMENT_RELATED_SHIPMENT_KEYS } = require('../scheme/celonis/shipmentRelatedShipment.scheme.js');
const { SHIPMENT_ROUTE_SEGMENT_KEYS } = require('../scheme/celonis/shipmentRouteSegment.scheme.js');
const { SHIPMENT_STATE_KEYS } = require('../scheme/celonis/shipmentState.scheme.js');
const { SHIPMENT_STOP_KEYS } = require('../scheme/celonis/shipmentStop.scheme.js');

/**
 * Pushes files to Celonis.
 * @returns {Promise<void>} A promise that resolves when the files are pushed successfully, or rejects with an error.
 */
async function push() {
  try{
    logger.info('Pushing files to Celonis.');
    // Check to see if root directory exist 'parquetFiles'
    const rootDirName = `${path.resolve(__dirname)}/../parquetFiles`;
    // if exists
    if (fs.existsSync(rootDirName)) {
      var directories = fs.readdirSync(rootDirName);
      if(directories.length > 0) {
  
        for(var d = 0; d < directories.length; d++) {
  
          // Get the table keys to send to Celonis
          var keys = getKeys(directories[d]);
  
          // read directories
          const dirName = `${rootDirName}/${directories[d]}`;
          logger.info(`Reading Directory ${dirName}.`);
  
          var files = fs.readdirSync(dirName);
          logger.info(`Files: ${dirName} ${files.length}`);
          if(files.length > 0) {
            // Create Job
            var job = await createJob(keys, directories[d]);  
            logger.info(`Job Created for ${directories[d]}: ${job.data.id}`);
            for(var f = 0; f < files.length; f++) {
  
              const fileName = path.join(dirName, files[f]);
              logger.info(`Uploading File ${fileName} for Job ${job.data.id}.`);
              // Upload file to Celonis
              await uploadJobFile(job.data.id, fileName);
              logger.info(`Deleting File ${fileName}.`);
              // Delete file from staging
              await fs.unlinkSync(fileName);
            } 
            // Execute Job
            await executeJob(job.data.id);
          } else {
            logger.info(`No files found in ${dirName}.`);
          };   
        };
      } else {
        logger.info(`No directories found in ${rootDirName}.`);
      }
    }
  } catch (error) {
    logger.error(`Error pushing files to Celonis: ${error}`);
  } 
}

/**
 * Retrieves the keys based on the provided directory name.
 *
 * @param {string} dirname - The name of the directory.
 * @returns {String|null} - The keys associated with the directory, or null if no keys are found.
 */
function getKeys(dirname) {
  switch (dirname) {
    case 'shipment_attributes':
      return SHIPMENT_ATTRIBUTE_KEYS;
    case 'shipment_events':
      return SHIPMENT_EVENT_KEYS;
    case 'shipment_event_details':
      return SHIPMENT_EVENT_DETAIL_KEYS;
    case 'shipment_identifiers':
      return SHIPMENT_IDENTIFIER_KEYS;
    case 'shipment_orders':
      return SHIPMENT_ORDER_KEYS;
    case 'shipment_order_items':
      return SHIPMENT_ORDER_ITEM_KEYS;
    case 'shipment_positions':
      return SHIPMENT_POSITION_KEYS;
    case 'shipment_related_shipments':
      return SHIPMENT_RELATED_SHIPMENT_KEYS;
    case 'shipment_route_segments':
      return SHIPMENT_ROUTE_SEGMENT_KEYS;
    case 'shipment_states':
      return SHIPMENT_STATE_KEYS;
    case 'shipment_stops':
      return SHIPMENT_STOP_KEYS;
    default:
      return null;}
}

module.exports = {
  push
};