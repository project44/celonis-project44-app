const cron = require('node-cron');
const {logger} = require('../utils/logger.js');
const { CRON_SCHEDULE } = require('../config/config.js');
const { push } = require('./celonis.push.controller.js');

async function startCronJob() {
  cron.schedule(CRON_SCHEDULE, async () => {
    push();
  });
}

async function stopCronJob() {
  logger.info('Cron Job Stopped.');
  cron.cancelAll();
}

module.exports = {
  startCronJob,
  stopCronJob
};
