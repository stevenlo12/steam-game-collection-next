const db = require('../models');

const systemHandler = {
    // Health check endpoint
    async healthCheck(req, res) {
        try {
            // Test database connection
            await db.sequelize.authenticate();
            res.json({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                database: 'connected',
                uptime: process.uptime()
            });
        } catch (error) {
            res.status(503).json({
                status: 'unhealthy',
                timestamp: new Date().toISOString(),
                database: 'disconnected',
                error: error.message
            });
        }
    }
};

module.exports = systemHandler;
