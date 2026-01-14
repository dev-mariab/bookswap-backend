import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from 'dotenv';

config();

import healthRoutes from './routes/health';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', healthRoutes);

app.get('/', (req, res) => {
  res.json({
    message: '📚 BookSwap Academy API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      docs: 'Em breve...',
    },
    environment: process.env.NODE_ENV,
    database: process.env.DB_NAME,
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.originalUrl,
    availableRoutes: ['/', '/api/health'],
  });
});

app.listen(PORT, () => {
  console.log(`
  BOOKSWAP ACADEMY
  ====================
  Servidor rodando na porta: ${PORT}
  Ambiente: ${process.env.NODE_ENV}
  Banco: ${process.env.DB_NAME}
  
  Health Check: http://localhost:${PORT}/api/health
  Página inicial: http://localhost:${PORT}/
  `);
});

export default app;