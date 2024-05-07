const parquet = require('parquetjs');
const fs = require('fs');
const path = require('path');
const {logger} = require('./logger.js');
const dayjs = require('dayjs');

/**
 * Writes data to a Parquet file.
 * @param {Array} data - The data to be written to the Parquet file.
 * @param {string} shipmentId - The shipment ID.
 * @param {string} section - The section of the Parquet file.
 * @param {object} schema - The schema of the Parquet file.
 * @returns {string} - The filename of the created Parquet file.
 */
async function writeParquetFile(data, section, schema, shipmentId) {

  var formattedDate = dayjs().format('YYYYMMDDHHmmssSSS');

  await checkDirectory(`${path.resolve(__dirname)}/../parquetFiles`);
  await checkDirectory(`${path.resolve(__dirname)}/../parquetFiles/${section}`);
  
  const filename = `${path.resolve(__dirname)}/../parquetFiles/${section}/${shipmentId}_${formattedDate}.parquet`;
  
  logger.info(`Creating File ${filename}.`);
  
  try {
    if(data && data.length > 0) {
      const writer = await parquet.ParquetWriter.openFile(schema, filename, {useDataPageV2: false});
      for (let i = 0; i < data.length; i++) {
        // logger.info(JSON.stringify(data[i]));
        await writer.appendRow(data[i]);
      }
      await writer.close();
      logger.info(`File ${filename} Created.`);
  
      return filename;
    } else {
      logger.info(`No Data. File ${filename} Was Not Created.`);
      return filename;
    }
      
  } catch (error) {
    logger.error(error);
    return filename;    
  }
}

/**
 * Deletes a Parquet file.
 * @param {string} filename - The name of the file to be deleted.
 * @returns {Promise<void>} - A promise that resolves when the file is successfully deleted.
 */
async function deleteParquetFile(filename) {
  await fs.unlink(filename, (err) => {
    if (err) {
      logger.error(err);
      return;
    }
    logger.info(`File ${filename} Removed.`);
  });
}

/**
 * Checks if a directory exists and creates it if it doesn't.
 * @param {string} directory - The directory path to check/create.
 * @returns {Promise<void>} - A promise that resolves when the directory is checked/created.
 */
async function checkDirectory(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
}

module.exports = {
  writeParquetFile,
  deleteParquetFile,
};