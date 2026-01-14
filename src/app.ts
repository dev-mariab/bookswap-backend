import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from 'dotenv';
import bookRoutes from './routes/books';

config();

import healthRoutes from './routes/health';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use('/api/health', healthRoutes);
app.use('/api/livros', bookRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'BookSwap Academy API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      livros: {
        get: '/api/livros',
        post: '/api/livros',
        getById: '/api/livros/:id',
        delete: '/api/livros/:id'
      },
      patterns: '/api/patterns',
      testPatterns: '/api/test/patterns'
    },
    environment: process.env.NODE_ENV || 'development',
    database: process.env.DB_NAME || 'bookswap',
  });
});

app.get('/api/test/patterns', async (req, res) => {
  try {
    const { PricingContext, SalePricingStrategy, TradePricingStrategy, DonationPricingStrategy } = await import('./strategies/PricingStrategy');
    const { NotificationFactoryProducer } = await import('./factories/NotificationFactory');
    
    const strategies = {
      venda: new PricingContext(new SalePricingStrategy()),
      troca: new PricingContext(new TradePricingStrategy()),
      doacao: new PricingContext(new DonationPricingStrategy())
    };
    
    res.json({
      success: true,
      patterns: {
        strategy: {
          venda: strategies.venda.executeCalculation(50),
          troca: strategies.troca.executeCalculation(50),
          doacao: strategies.doacao.executeCalculation(50)
        },
        factory: {
          available: ['email', 'inapp', 'push']
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.originalUrl,
    availableRoutes: [
      '/',
      '/api/health',
      '/api/livros',
      '/api/patterns',
      '/api/test/patterns'
    ],
  });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erro:', err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('BOOKSWAP BACKEND - PDS');
  console.log('='.repeat(50));
  console.log(`Servidor rodando: http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Livros API: http://localhost:${PORT}/api/livros`);
  console.log('='.repeat(50));
});

export default app;