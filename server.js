const express = require("express");
const cors = require('cors');
const { StatusCodes } = require('http-status');
const { logger } = require('./utils/logger.js');
const { PORT } = require('./config/config.js');
const v1Routes = require('./routes/v1/webhook.js');
const v2Routes = require('./routes/v2/webhook.js');
const { authenticateCredentials } = require('./controllers/v1/authentication.controller.js');

const httpStatus = require('http-status');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError.js');

const pushToCelonisCronJob = require('./controllers/v1/cron.controller.js');

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
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));  // Increase form data limit 

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  logger.info(`${req.method} ${req.originalUrl} - ${res.statusCode}`);
  next();
});

// Mount v1Routes
app.use('/v1/api', authenticateCredentials, v1Routes);
app.use('/v2/api', authenticateCredentials, v2Routes);

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