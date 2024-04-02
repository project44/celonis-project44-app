const fs = require('fs');

function toCamelCase(str) {
  return str.replace(/_([a-z])/g, (match, p1) => p1.toUpperCase());
};

function toUnderbar(str) {
  return str.replace(/([A-Z])/g, (match) => `_${match.toLowerCase()}`);
}

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
