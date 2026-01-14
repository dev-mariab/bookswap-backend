"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const models_1 = require("../models");
const router = (0, express_1.Router)();
router.get('/health', async (req, res) => {
    const healthCheck = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        checks: {
            database: 'pending',
            environment: 'pending',
            memory: 'pending',
        },
    };
    try {
        await models_1.sequelize.authenticate();
        healthCheck.checks.database = 'healthy';
        const [usersCount] = await models_1.sequelize.query('SELECT COUNT(*) FROM "Users"');
        const [livrosCount] = await models_1.sequelize.query('SELECT COUNT(*) FROM "Livros"');
        healthCheck.databaseDetails = {
            connected: true,
            users: parseInt(usersCount[0]?.count || '0'),
            livros: parseInt(livrosCount[0]?.count || '0'),
            dialect: models_1.sequelize.getDialect(),
        };
    }
    catch (error) {
        healthCheck.status = 'unhealthy';
        healthCheck.checks.database = 'unhealthy';
        healthCheck.databaseError = error.message;
    }
    healthCheck.environment = process.env.NODE_ENV || 'development';
    healthCheck.checks.environment = 'healthy';
    const used = process.memoryUsage();
    healthCheck.memory = {
        rss: `${Math.round(used.rss / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(used.heapTotal / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(used.heapUsed / 1024 / 1024)} MB`,
    };
    healthCheck.checks.memory = 'healthy';
    const statusCode = healthCheck.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(healthCheck);
});
exports.default = router;
//# sourceMappingURL=health.js.map