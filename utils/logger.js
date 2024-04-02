const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const config = require('../config/config');

const enumerateErrorFormat = winston.format(info => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const transport = new winston.transports.DailyRotateFile({
  level: 'info',
  filename: 'application_%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
});

transport.on('rotate', function(oldFilename, newFilename) {
  // do something fun
});

transport.on('error', error => {
  console.log('Error occurred');
  console.error(error)
});

const logger = winston.createLogger({
  level: config.env === 'development' ? 'debug' : 'info', 
  format: winston.format.combine(
    enumerateErrorFormat(),
    config.ENV === 'development' ? winston.format.colorize() : winston.format.uncolorize(),
    winston.format.splat(),
    winston.format.printf(({ level, message }) => `${level}: ${message}`)
  ),
  transports: [new winston.transports.Console(
    {
      stderrLevels: ['error'],
    }
  )],
});

module.exports = {
  logger,
  stream: {
    write: message => logger.info(message),
  },
}