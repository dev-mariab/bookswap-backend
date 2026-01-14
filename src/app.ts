import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from 'dotenv';
import bookRoutes from './routes/books';

<<<<<<< HEAD
config();

import healthRoutes from './routes/health';
=======
import { 
  PricingContext, 
  SalePricingStrategy, 
  TradePricingStrategy, 
  DonationPricingStrategy 
} from './strategies/PricingStrategy';

import { NotificationFactoryProducer } from './factories/NotificationFactory';
import { BookRepository, CachedBookRepository } from './repositories/BookRepository';
import { NotificationBuilder } from './factories/NotificationFactory';
>>>>>>> da0b43ca9282f91ba7be85f87c2c7e352b57a9db

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

<<<<<<< HEAD
app.use('/api/health', healthRoutes);
app.use('/api/livros', bookRoutes);

app.get('/', (req, res) => {
=======
const bookRepository = new CachedBookRepository(new BookRepository());

app.get('/api', (req, res) => {
>>>>>>> da0b43ca9282f91ba7be85f87c2c7e352b57a9db
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

<<<<<<< HEAD
app.get('/api/test/patterns', async (req, res) => {
  try {
    const { PricingContext, SalePricingStrategy, TradePricingStrategy, DonationPricingStrategy } = await import('./strategies/PricingStrategy');
    const { NotificationFactoryProducer } = await import('./factories/NotificationFactory');
    
=======
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    message: 'BookSwap API está rodando perfeitamente!',
    patterns: '5 padrões de projeto implementados'
  });
});

app.get('/api/database', async (req, res) => {
  try {
    const isConnected = await testConnection();
    if (isConnected) {
      res.json({
        status: 'connected',
        database: 'PostgreSQL',
        details: {
          host: process.env.DB_HOST || 'localhost',
          port: process.env.DB_PORT || 5432,
          name: process.env.DB_NAME || 'aplicacao_pds',
          user: process.env.DB_USER || 'postgres'
        },
        message: 'Conexão com banco de dados estabelecida com sucesso!'
      });
    } else {
      res.status(500).json({
        status: 'disconnected',
        error: 'Não foi possível conectar ao banco'
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
});

app.get('/api/test-table', async (req, res) => {
  try {
    const sequelize = await import('./config/database');
    
    await sequelize.default.query(`
      CREATE TABLE IF NOT EXISTS alunos_pds (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        matricula VARCHAR(20) UNIQUE,
        email VARCHAR(100),
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      INSERT INTO alunos_pds (nome, matricula, email) 
      VALUES ('Aluno Teste', '20240001', 'aluno@bookswap.com')
      ON CONFLICT (matricula) DO NOTHING;
    `);
    
    const [results] = await sequelize.default.query('SELECT * FROM alunos_pds');
    
    res.json({
      success: true,
      message: 'Tabela criada e teste realizado!',
      data: results,
      total: Array.isArray(results) ? results.length : 0
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
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


app.get('/api/livros', async (req, res) => {
  try {
    console.log('Buscando todos os livros via Repository Pattern');
    
    const filters = {
      curso: req.query.curso as string || '',
      condicao: req.query.condicao as string || '',
      precoMin: req.query.precoMin as string || '',
      precoMax: req.query.precoMax as string || ''
    };
    
    let books;
    
    if (filters.curso) {
      books = await bookRepository.findByCourse(filters.curso);
    } else if (filters.condicao) {
      books = await bookRepository.findByCondition(filters.condicao);
    } else {
      books = await bookRepository.findAll();
    }
    
    if (filters.precoMin || filters.precoMax) {
      const min = filters.precoMin ? parseFloat(filters.precoMin) : 0;
      const max = filters.precoMax ? parseFloat(filters.precoMax) : Infinity;
      
      books = books.filter((book: any) => {
        const preco = book.preco || book.dataValues?.preco || 0;
        return preco >= min && preco <= max;
      });
    }
    
    res.json({
      success: true,
      count: books.length,
      data: books,
      filters: filters,
      message: `Encontrados ${books.length} livros usando Repository Pattern`
    });
    
  } catch (error: any) {
    console.error('Erro ao buscar livros:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/livros/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Buscando livro ID: ${id}`);
    
    const book = await bookRepository.findById(id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Livro não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: book
    });
    
  } catch (error: any) {
    console.error('Erro ao buscar livro por ID:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/livros', async (req, res) => {
  try {
    console.log('Recebendo requisição para criar livro');
    console.log('Dados recebidos:', JSON.stringify(req.body, null, 2));
    
    const { 
      titulo, 
      autor, 
      preco, 
      condicao, 
      descricao, 
      curso, 
      listingType = 'venda',
      userId = 'user-123' 
    } = req.body;
    
    if (!titulo || !autor) {
      return res.status(400).json({
        success: false,
        error: 'Título e autor são obrigatórios'
      });
    }
    
    console.log('💰 Aplicando Strategy Pattern para cálculo de preço...');
    
    let pricingStrategy;
    switch(listingType.toLowerCase()) {
      case 'venda':
        pricingStrategy = new SalePricingStrategy();
        console.log('Usando estratégia de VENDA');
        break;
      case 'troca':
        pricingStrategy = new TradePricingStrategy();
        console.log('Usando estratégia de TROCA');
        break;
      case 'doacao':
        pricingStrategy = new DonationPricingStrategy();
        console.log('Usando estratégia de DOAÇÃO');
        break;
      default:
        pricingStrategy = new SalePricingStrategy();
        console.log('Tipo desconhecido, usando VENDA como padrão');
    }
    
    const pricingContext = new PricingContext(pricingStrategy);
    const finalPrice = pricingContext.executeCalculation(preco || 0);
    
    console.log(`Preço base: R$ ${preco || 0}, Preço final: R$ ${finalPrice}`);
    
    const bookData = {
      titulo,
      autor,
      preco: finalPrice,
      condicao: condicao || 'bom',
      descricao: descricao || `Livro "${titulo}" por ${autor}`,
      curso: curso || 'Engenharia',
      tipo: listingType,
      imagem: req.body.imagem || 'https://via.placeholder.com/300x400?text=BookSwap',
      vendedor: req.body.vendedor || 'Usuário BookSwap',
      avaliacao: 5.0,
      localizacao: req.body.localizacao || 'Campus Central',
      userId,
      createdAt: new Date()
    };
    
    console.log('Salvando livro via Repository Pattern...');
    const newBook = await bookRepository.create(bookData);
    console.log(`Livro salvo com ID: ${newBook.id}`);
    
    console.log('Aplicando Factory Method Pattern para notificações...');
    
    try {
      const notificationFactory = NotificationFactoryProducer.getFactory('inapp');
      await notificationFactory.notifyUser(
        userId,
        `Seu livro "${titulo}" foi publicado com sucesso no BookSwap!`,
        {
          bookId: newBook.id,
          listingType: listingType,
          actionUrl: `/livros/${newBook.id}`,
          priority: 'high'
        }
      );
      console.log('Notificação in-app enviada');
      
      const notificationResults = await new NotificationBuilder()
        .setUserId(userId)
        .setMessage(`Seu livro "${titulo}" está disponível para ${listingType}`)
        .setMetadata({
          bookId: newBook.id.toString(),
          listingType: listingType,
          actionUrl: `http://localhost:3000/livros/${newBook.id}`
        })
        .setTypes(['inapp']) 
        .setPriority('medium')
        .buildAndSend();
      
      console.log('Resultados das notificações:', notificationResults);
      
    } catch (notificationError: any) {
      console.warn('Erro nas notificações (não crítico):', notificationError.message);
    }
    
    res.status(201).json({
      success: true,
      message: 'Livro criado com sucesso!',
      data: newBook,
      patterns: {
        strategy: 'Preço calculado via Strategy Pattern',
        factory: 'Notificação enviada via Factory Method',
        repository: 'Dados persistidos via Repository Pattern'
      },
      finalPrice: finalPrice,
      listingType: listingType
    });
    
  } catch (error: any) {
    console.error('Erro ao criar livro:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.put('/api/livros/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Atualizando livro ID: ${id}`);
    
    const updatedBook = await bookRepository.update(id, req.body);
    
    if (!updatedBook) {
      return res.status(404).json({
        success: false,
        error: 'Livro não encontrado para atualização'
      });
    }
    
    res.json({
      success: true,
      message: 'Livro atualizado com sucesso!',
      data: updatedBook
    });
    
  } catch (error: any) {
    console.error('Erro ao atualizar livro:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.delete('/api/livros/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Deletando livro ID: ${id}`);
    
    const deleted = await bookRepository.delete(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Livro não encontrado para exclusão'
      });
    }
    
    res.json({
      success: true,
      message: 'Livro deletado com sucesso!',
      deletedId: id
    });
    
  } catch (error: any) {
    console.error('Erro ao deletar livro:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
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
>>>>>>> da0b43ca9282f91ba7be85f87c2c7e352b57a9db
    const strategies = {
      venda: new PricingContext(new SalePricingStrategy()),
      troca: new PricingContext(new TradePricingStrategy()),
      doacao: new PricingContext(new DonationPricingStrategy())
    };
    
<<<<<<< HEAD
=======
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
    
>>>>>>> da0b43ca9282f91ba7be85f87c2c7e352b57a9db
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
<<<<<<< HEAD
      }
=======
      },
      summary: 'Todos os 5 padrões de projeto estão implementados e funcionando!'
>>>>>>> da0b43ca9282f91ba7be85f87c2c7e352b57a9db
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

<<<<<<< HEAD
app.use('*', (req, res) => {
=======
app.use((req, res) => {
>>>>>>> da0b43ca9282f91ba7be85f87c2c7e352b57a9db
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

<<<<<<< HEAD
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erro:', err);
=======
app.use((error: any, req: any, res: any, next: any) => {
  console.error('Erro não tratado:', error);
>>>>>>> da0b43ca9282f91ba7be85f87c2c7e352b57a9db
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

<<<<<<< HEAD
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
=======
app.listen(PORT, async () => {
  console.log('='.repeat(70));
  console.log('BOOKSWAP ACADEMY - PADRÕES DE DESENVOLVIMENTO DE SOFTWARE');
  console.log('='.repeat(70));
  console.log(`Servidor: http://localhost:${PORT}`);
  console.log(`API Base: http://localhost:${PORT}/api`);
  console.log(`Database: http://localhost:${PORT}/api/database`);
  console.log(`Padrões: http://localhost:${PORT}/api/patterns`);
  console.log(`Livros: http://localhost:${PORT}/api/livros`);
  console.log(`Teste: http://localhost:${PORT}/api/test/patterns`);
  console.log('='.repeat(70));
  console.log('='.repeat(70));
  
  try {
    await testConnection();
    console.log('Conectado ao PostgreSQL com sucesso!');
  } catch (error) {
    console.warn('Não foi possível conectar ao banco de dados');
    console.warn('Algumas funcionalidades podem não funcionar corretamente');
  }
  
  console.log('PRONTO PARA CONECTAR COM FRONTEND!');
  console.log('Teste os padrões em: http://localhost:3001/api/test/patterns');
  console.log('='.repeat(70));
});
>>>>>>> da0b43ca9282f91ba7be85f87c2c7e352b57a9db
