const express = require("express");
const cors = require('cors');
const { StatusCodes } = require('http-status');
const { logger } = require('./utils/logger.js');
const { PORT } = require('./config/config.js');
// const webhookRoutes = require("./routes/p44webhook.routes");
const routes = require('./routes/webhook.js');
const { authenticateCredentials } = require('./controllers/authentication.controller.js');

const httpStatus = require('http-status');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError.js');

const pushToCelonisCronJob = require('./controllers/cron.controller.js');

const app = express();
const port = PORT || 3000;

// Unexpected error handler
process.on('uncaughtException', (error) => {
  logger.error(error.stack);
  process.exit(1); // Exit with non-zero code to indicate error
});

process.on('unhandledRejection', (error) => {
  logger.error(error.stack);
  process.exit(1); // Exit with non-zero code to indicate error
});

// Exit handler
const exitHandler = (options, exitCode) => {
  if (options.exitCode || exitCode) {
    logger.info(`Exit with code: ${exitCode}`);
    process.exit(exitCode);
  } else {
    logger.info('Server shutting down...');
  }
};

process.on('exit', exitHandler.bind(null, { exiting: true }));
process.on('SIGINT', exitHandler.bind(null, { exiting: true })); // Handle SIGINT (Ctrl+C)
process.on('SIGTERM', exitHandler.bind(null, { exiting: true })); // Handle SIGTERM (termination signal)

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());
app.options('*', cors());

// Parse JSON
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  logger.info(`${req.method} ${req.originalUrl} - ${res.statusCode}`);
  next();
});

// Mount routes
app.use('/v1/api', authenticateCredentials, routes);

// Convert error to ApiError, if needed
app.use(errorConverter);

// Error handling
app.use((req, res, next) => {
  next();
  throw new ApiError(httpStatus.NOT_FOUND, 'Not found', false, '');
}); 

app.listen(port, () => {
  pushToCelonisCronJob.startCronJob();
  logger.info(`Server listening on port ${port}`);
});