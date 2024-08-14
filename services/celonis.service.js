// process.env.AWS_SDK_LOAD_CONFIG = 1;
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

const { CELONIS_API_SERVER, CELONIS_API_KEY, CELONIS_POOL_ID } = require('../config/config.js');
const { logger } = require('../utils/logger.js');

const headers = {
  'Authorization': `AppKey ${CELONIS_API_KEY}`, // Replace with your access token
  'Content-Type': 'application/json',
};

const fileUploadHeaders = {
  'Authorization': `AppKey ${CELONIS_API_KEY}`, // Replace with your access token
  'Content-Type': 'multipart/form-data',
};

const data = {
  'fileType': 'PARQUET',
  'dataPoolId': `${CELONIS_POOL_ID}`
}

/**
 * STEP 1: Creates a job in the Celonis system for data push.
 * @param {Array<string>} keys - An array of strings representing the keys of the parquet file.
 * @param {string} targetName - The name of the target for the job.
 * @param {string} [type='DELTA'] - The type of the job. Defaults to 'DELTA'.
 * @returns {Promise<Object>} - A promise that resolves to the response object from the API call.
 * @throws {Error} - If there is an error creating the job.
 */
const createJob = async (keys, targetName, type='DELTA') => {
  // keys should be an array of strings that represent the keys of the parquet file.
  data.keys = keys;
  data.type = type;
  data.targetName = targetName;

  const url = `${CELONIS_API_SERVER}/integration/api/v1/data-push/${CELONIS_POOL_ID}/jobs/`;

  try {
    const response = await axios.post(url, data, { headers });
    if (response.status !== 200) {
      throw new Error(`Error creating job: Status code ${response.status}`);
    }
    return response;
  } catch (error) {
    logger.error(`createJob: ${url} ${error}`);
    throw error;
  }
};

/**
 * STEP 2: Uploads a Parquet file to a Celonis job.
 *
 * @param {string} jobId - The ID of the Celonis job.
 * @param {string} filePath - The path to the Parquet file to upload.
 * @returns {Promise<Object>} - A Promise that resolves to the response object from the upload request.
 * @throws {Error} - If there is an error uploading the file.
 */
const uploadJobFile = async (jobId, filePath) => {
  const url = `${CELONIS_API_SERVER}/integration/api/v1/data-push/${CELONIS_POOL_ID}/jobs/${jobId}/chunks/upserted`;
  logger.info(`Uploading file ${filePath} to ${url}`);

  try {
    let data = new FormData();
    // Open the parquet file as a readable stream
    const fileStream = fs.createReadStream(filePath);

    // Append the file stream to the FormData with a field name (e.g., 'file')
    data.append('file', fileStream, filePath);
 
    const response = await axios.post(url, data, { headers: fileUploadHeaders });

    if (response.status !== 200) {
      throw new Error(`Error uploading file: Status code ${response.status}`);
    }
    return response;
  } catch (error) {
    logger.error(`uploadJobFile: ${url} ${error}`);
    throw error;
  }
};

/**
 * STEP 3: Executes a job in Celonis.
 *
 * @param {string} jobId - The ID of the job to execute.
 * @returns {Promise<Object>} - A promise that resolves to the response object.
 * @throws {Error} - If there is an error executing the job.
 */
const executeJob = async (jobId) => {
  const url = `${CELONIS_API_SERVER}/integration/api/v1/data-push/${CELONIS_POOL_ID}/jobs/${jobId}`;
  try {
    const response = await axios.post(url, {}, { headers });
    if (response.status !== 200) {
      throw new Error(`Error executing job: Status code ${response.status}`);
    }

    return response;
  } catch (error) {
    logger.error(`executeJob: ${url} ${error}`);
    throw error;
  }
};

/**
 * Uploads a file to an S3 bucket using the Celonis API.
 * 
 * @param {string} celonisApp - The Celonis app name - this is some app name created by Celonis.
 * @param {string} fileName - The name of the file to upload - this is a file that was created in a previous step.
 * @param {string} connectionId - The connection ID - typcally this is a UUID.
 * @param {string} accessKey - The S3 access key.
 * @param {string} accessSecret - The S3 access secret.
 * @param {string} [region='us-east-1'] - The S3 region (default is 'us-east-1').
 * @param {string} [bucket='continuous'] - The S3 bucket name (default is 'continuous').
 * @param {string} [targetTable='shipment'] - The target table name (default is 'shipment').
 * @returns {Promise<void>} - A promise that resolves when the file is uploaded successfully.
 */
const uploadToS3 = async (celonisApp, fileName, connectionId, accessKey, accessSecret, region='us-east-1', urlregion='us-1', bucket='continuous', targetTable='shipment') => {
  //https://logistics-apps.us-1.celonis.cloud/api/data-ingestion
  const endpoint_url = `https://${celonisApp}.${urlregion}.celonis.cloud/api/data-ingestion`;
  logger.info(`Uploading file ${fileName} to ${endpoint_url}`);
  const s3 = new AWS.S3({
    endpoint: endpoint_url,
    region: region,
    accessKeyId: accessKey,
    secretAccessKey: accessSecret,
    s3ForcePathStyle: true,
  });

  
  // AWS.config.loadFromPath('./config.json');

  // Read the file content
  fileName = fileName.substring(fileName.lastIndexOf('/') + 1);
  const rootDirName = `${path.resolve(__dirname)}`.replace('services', 'parquetFiles');
  logger.info(`Reading rootDir ${rootDirName}`);
  const fileDir = `${rootDirName}/json/${fileName}`;
  logger.info(`Reading file ${fileDir}`);
  var fileContent = fs.readFileSync(`${fileDir.toString()}`);
  logger.info(`File ${rootDirName}/json/${fileName} read. ${fileContent.length} bytes`);

  // Construct the object name
  const objectName = `connection/${connectionId}/${targetTable}/${fileName}`;

  // Upload parameters
  const params = {
    Bucket: bucket,
    Key: objectName, 
    Body: fileContent 
  };
  
  try {
    console.log(`File ${fileName} uploading to ${bucket}/${objectName}`);
    await s3.upload(params).promise();
    console.log(`File ${fileName} uploaded to ${bucket}/${objectName}`);
    return fileName;
  } catch (err) {
    if (err.code === 'NoSuchKey') {
      console.error(`The file ${fileName} was not found`);
    } else {
      console.error(`Error uploading file:`, err);
    }
  }
}

module.exports = {
  createJob,
  uploadJobFile,
  executeJob,
  uploadToS3
};