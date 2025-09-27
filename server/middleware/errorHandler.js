/**
 * Error handling middleware for BadgerCite Server
 * Provides consistent error responses and logging
 */

const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error('Unhandled error:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV !== 'production';

  // Default error response
  const errorResponse = {
    error: 'Internal Server Error',
    message: isDevelopment ? err.message : 'Something went wrong. Please try again later.',
    timestamp: new Date().toISOString()
  };

  // Add stack trace in development
  if (isDevelopment) {
    errorResponse.stack = err.stack;
  }

  // Send appropriate status code
  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;