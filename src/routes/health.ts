import { Router } from 'express';
import db from '../models'; 
const { sequelize } = db;   

const router = Router();

router.get('/', async (req, res) => {
  const healthCheck: any = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    checks: {
      database: 'pending',
      environment: 'pending',
      memory: 'pending',
    },
  };

  try {
    await sequelize.authenticate();
    healthCheck.checks.database = 'healthy';
    
    const [usersResult]: any = await sequelize.query('SELECT COUNT(*) FROM "usuarios"');
    const [booksResult]: any = await sequelize.query('SELECT COUNT(*) FROM "Books"');
    
    healthCheck.databaseDetails = {
      connected: true,
      users: parseInt(usersResult[0]?.count || '0'),
      books: parseInt(booksResult[0]?.count || '0'),
      dialect: sequelize.getDialect(),
    };
  } catch (error: any) {
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

export default router;