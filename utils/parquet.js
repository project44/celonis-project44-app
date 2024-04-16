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
async function writeParquetFile(data, section, schema, shipmentId='STAGING') {

  var formattedDate = dayjs().format('YYYYMMDDHHmmssSSS');

  await checkDirectory(`${path.resolve(__dirname)}/../parquetFiles`);
  await checkDirectory(`${path.resolve(__dirname)}/../parquetFiles/${section}`);
  
  const filename = `${path.resolve(__dirname)}/../parquetFiles/${section}/${shipmentId}_${formattedDate}.parquet`;
  
  logger.info(`Creating File ${filename}.`);
  
  try {
    if(data && data.length > 0) {
      const writer = await parquet.ParquetWriter.openFile(schema, filename, {useDataPageV2: false});
      for (let i = 0; i < data.length; i++) {
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
    return null;    
  }
}

async function readParquetFile(filename) {
  logger.info(`${filename}`);
  const reader = await parquet.ParquetReader.openFile(filename);
  const cursor = reader.getCursor();
  const records = [];
  let record = null;
  while (record = await cursor.next()) {
    records.push(record);
  }
  await reader.close();
  return records;
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

async function checkDirectory(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
}

module.exports = {
  writeParquetFile,
  readParquetFile,
  deleteParquetFile,
};