const fs = require('fs');

/**
 * Converts a string to camel case.
 *
 * @param {string} str - The string to convert.
 * @returns {string} The camel case version of the input string.
 */
function toCamelCase(str) {
  return str.replace(/_([a-z])/g, (match, p1) => p1.toUpperCase());
};

/**
 * Converts a string to underbar case.
 *
 * @param {string} str - The string to convert.
 * @returns {string} The converted string in underbar case.
 */
function toUnderbar(str) {
  return str.replace(/([A-Z])/g, (match) => `_${match.toLowerCase()}`);
}

/**
 * Checks if a file exists synchronously.
 *
 * @param {string} filePath - The path of the file to check.
 * @returns {boolean} Returns true if the file exists, false otherwise.
 */
function checkFileExistsSync(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (err) {
    console.error('Error checking file:', err);
    return false;
  }
}

module.exports = { 
  toCamelCase, 
  toUnderbar,
  checkFileExistsSync
};
