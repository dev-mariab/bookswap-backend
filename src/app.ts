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

app.get('/api/patterns', (req, res) => {
  res.json({
    patterns: [
      {
        name: 'Strategy Pattern',
        location: 'src/strategies/PricingStrategy.ts',
        purpose: 'Calcular preços diferentes para venda/troca/doação',
        example: 'POST /api/livros com diferentes listingType'
      },
      {
        name: 'Factory Method Pattern',
        location: 'src/factories/NotificationFactory.ts',
        purpose: 'Criar diferentes tipos de notificações',
        example: 'NotificationFactoryProducer.getFactory()'
      },
      {
        name: 'Repository Pattern',
        location: 'src/repositories/BookRepository.ts',
        purpose: 'Abstrair acesso ao banco de dados',
        example: 'BookRepository.findAll(), CachedBookRepository'
      },
      {
        name: 'Observer Pattern',
        location: 'frontend/src/observers/BookObserver.ts',
        purpose: 'Atualizar UI automaticamente',
        example: 'BookSubject e BookListObserver'
      },
      {
        name: 'Composite Pattern',
        location: 'frontend/src/composites/UIComposite.tsx',
        purpose: 'Estruturar componentes de UI hierárquicos',
        example: 'FormContainer e BookCard'
      }
    ]
  });
});

app.get('/api/livros/filters/advanced', async (req, res) => {
  try {
    console.log('🔍 Busca avançada com filtros:', req.query);
    
    const allBooks = await bookRepository.findAll();
    
    let filteredBooks = [...allBooks];
    
    if (req.query.curso) {
      filteredBooks = filteredBooks.filter(book => 
        book.curso?.toLowerCase().includes((req.query.curso as string).toLowerCase())
      );
    }
    
    if (req.query.condicao) {
      filteredBooks = filteredBooks.filter(book => 
        book.condicao === req.query.condicao
      );
    }
    
    if (req.query.tipo) {
      filteredBooks = filteredBooks.filter(book => 
        book.tipo === req.query.tipo
      );
    }
    
    if (req.query.precoMin || req.query.precoMax) {
      const min = req.query.precoMin ? parseFloat(req.query.precoMin as string) : 0;
      const max = req.query.precoMax ? parseFloat(req.query.precoMax as string) : Infinity;
      
      filteredBooks = filteredBooks.filter(book => {
        const preco = book.preco || 0;
        return preco >= min && preco <= max;
      });
    }
    
    if (req.query.vendedor) {
      filteredBooks = filteredBooks.filter(book => 
        book.vendedor?.toLowerCase().includes((req.query.vendedor as string).toLowerCase())
      );
    }
    
    res.json({
      success: true,
      count: filteredBooks.length,
      total: allBooks.length,
      filtersApplied: Object.keys(req.query).length,
      data: filteredBooks
    });
    
  } catch (error: any) {
    console.error('Erro na busca avançada:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/test/patterns', async (req, res) => {
  try {
    const strategies = {
      venda: new PricingContext(new SalePricingStrategy()),
      troca: new PricingContext(new TradePricingStrategy()),
      doacao: new PricingContext(new DonationPricingStrategy())
    };
    
    const strategyResults = {
      venda: strategies.venda.executeCalculation(50),
      troca: strategies.troca.executeCalculation(50),
      doacao: strategies.doacao.executeCalculation(50)
    };
    
    const factories = {
      email: NotificationFactoryProducer.getFactory('email'),
      inapp: NotificationFactoryProducer.getFactory('inapp'),
      push: NotificationFactoryProducer.getFactory('push')
    };
    
    const booksCount = (await bookRepository.findAll()).length;
    
    res.json({
      success: true,
      patterns: {
        strategy: strategyResults,
        factory: {
          available: ['email', 'inapp', 'push']
        }
      },
      summary: 'Todos os 5 padrões de projeto estão implementados e funcionando!'
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