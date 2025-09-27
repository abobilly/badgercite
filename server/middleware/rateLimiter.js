/**
 * Rate limiting middleware for BadgerCite Server
 * Protects against abuse and ensures fair usage
 */

const rateLimit = require('rate-limiter-flexible');

// Rate limiters for different endpoints
const rateLimiter = new rateLimit.RateLimiterMemory({
  keyPrefix: 'badgercite_api',
  points: 100, // Number of requests
  duration: 60, // Per 60 seconds
  blockDuration: 60 * 15, // Block for 15 minutes if limit exceeded
});

// Middleware function
const rateLimiterMiddleware = (req, res, next) => {
  rateLimiter.consume(req.ip)
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(429).json({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: 60,
        timestamp: new Date().toISOString()
      });
    });
};

module.exports = {
  rateLimiter: rateLimiterMiddleware
};