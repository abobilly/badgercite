/**
 * Health check routes for BadgerCite Server
 * Provides system status and health monitoring
 */

const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

/**
 * GET /api/health
 * Basic health check endpoint
 */
router.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'badgercite-server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

/**
 * GET /api/health/detailed
 * Detailed health check with system information
 */
router.get('/detailed', (req, res) => {
  const health = {
    status: 'healthy',
    service: 'badgercite-server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    system: {
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version,
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024)
      }
    }
  };

  res.json(health);
});

/**
 * GET /api/health/ping
 * Simple ping endpoint for load balancers
 */
router.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

module.exports = router;