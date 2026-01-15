import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from 'dotenv';

config();

import { 
  PricingContext, 
  SalePricingStrategy, 
  TradePricingStrategy, 
  DonationPricingStrategy 
} from './strategies/PricingStrategy';
import { NotificationFactoryProducer } from './factories/NotificationFactory';
import { BookRepository, CachedBookRepository } from './repositories/BookRepository';
import { NotificationBuilder } from './factories/NotificationFactory';
import healthRoutes from './routes/health';
import bookRoutes from './routes/books';
import userRoutes from './routes/users';

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

const bookRepository = new CachedBookRepository(new BookRepository());

app.use('/api/health', healthRoutes);
app.use('/api/livros', bookRoutes);
app.use('/api/usuarios', userRoutes);

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
      usuarios: {
        list: '/api/usuarios',
        register: '/api/usuarios/register',
        getById: '/api/usuarios/:id',
        delete: '/api/usuarios/:id'
      }
    },
    environment: process.env.NODE_ENV || 'development',
    database: process.env.DB_NAME || 'bookswap',
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.originalUrl,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;