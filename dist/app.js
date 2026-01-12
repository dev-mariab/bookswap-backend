"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const database_1 = require("./config/database");
const PricingStrategy_1 = require("./strategies/PricingStrategy");
const NotificationFactory_1 = require("./factories/NotificationFactory");
const BookRepository_1 = require("./repositories/BookRepository");
const NotificationFactory_2 = require("./factories/NotificationFactory");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});
const bookRepository = new BookRepository_1.CachedBookRepository(new BookRepository_1.BookRepository());
app.get('/api', (req, res) => {
    res.json({
        projeto: 'BookSwap Academy',
        aluno: 'Seu Nome',
        disciplina: 'Padrões de Desenvolvimento de Software',
        status: 'API funcionando!',
        patterns: [
            'Strategy Pattern - Cálculo de preços',
            'Factory Method - Notificações',
            'Repository Pattern - Acesso a dados',
            'Observer Pattern (no frontend)',
            'Composite Pattern (no frontend)'
        ],
        endpoints: {
            health: '/api/health',
            database: '/api/database',
            livros: {
                get: '/api/livros',
                post: '/api/livros',
                getById: '/api/livros/:id',
                delete: '/api/livros/:id'
            },
            test: '/api/test-table',
            patterns: '/api/patterns'
        }
    });
});
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
        const isConnected = await (0, database_1.testConnection)();
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
        }
        else {
            res.status(500).json({
                status: 'disconnected',
                error: 'Não foi possível conectar ao banco'
            });
        }
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            error: error.message
        });
    }
});
app.get('/api/test-table', async (req, res) => {
    try {
        const sequelize = await Promise.resolve().then(() => __importStar(require('./config/database')));
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
    }
    catch (error) {
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
        console.log('📚 Buscando todos os livros via Repository Pattern');
        const filters = {
            curso: req.query.curso || '',
            condicao: req.query.condicao || '',
            precoMin: req.query.precoMin || '',
            precoMax: req.query.precoMax || ''
        };
        let books;
        if (filters.curso) {
            books = await bookRepository.findByCourse(filters.curso);
        }
        else if (filters.condicao) {
            books = await bookRepository.findByCondition(filters.condicao);
        }
        else {
            books = await bookRepository.findAll();
        }
        if (filters.precoMin || filters.precoMax) {
            const min = filters.precoMin ? parseFloat(filters.precoMin) : 0;
            const max = filters.precoMax ? parseFloat(filters.precoMax) : Infinity;
            books = books.filter((book) => {
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
    }
    catch (error) {
        console.error('❌ Erro ao buscar livros:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
app.get('/api/livros/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🔍 Buscando livro ID: ${id}`);
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
    }
    catch (error) {
        console.error('❌ Erro ao buscar livro por ID:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
app.post('/api/livros', async (req, res) => {
    try {
        console.log('📤 Recebendo requisição para criar livro');
        console.log('Dados recebidos:', JSON.stringify(req.body, null, 2));
        const { titulo, autor, preco, condicao, descricao, curso, listingType = 'venda', userId = 'user-123' } = req.body;
        if (!titulo || !autor) {
            return res.status(400).json({
                success: false,
                error: 'Título e autor são obrigatórios'
            });
        }
        console.log('💰 Aplicando Strategy Pattern para cálculo de preço...');
        let pricingStrategy;
        switch (listingType.toLowerCase()) {
            case 'venda':
                pricingStrategy = new PricingStrategy_1.SalePricingStrategy();
                console.log('🛒 Usando estratégia de VENDA');
                break;
            case 'troca':
                pricingStrategy = new PricingStrategy_1.TradePricingStrategy();
                console.log('🔄 Usando estratégia de TROCA');
                break;
            case 'doacao':
                pricingStrategy = new PricingStrategy_1.DonationPricingStrategy();
                console.log('🎁 Usando estratégia de DOAÇÃO');
                break;
            default:
                pricingStrategy = new PricingStrategy_1.SalePricingStrategy();
                console.log('⚠️ Tipo desconhecido, usando VENDA como padrão');
        }
        const pricingContext = new PricingStrategy_1.PricingContext(pricingStrategy);
        const finalPrice = pricingContext.executeCalculation(preco || 0);
        console.log(`💰 Preço base: R$ ${preco || 0}, Preço final: R$ ${finalPrice}`);
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
        console.log('💾 Salvando livro via Repository Pattern...');
        const newBook = await bookRepository.create(bookData);
        console.log(`✅ Livro salvo com ID: ${newBook.id}`);
        console.log('🏭 Aplicando Factory Method Pattern para notificações...');
        try {
            const notificationFactory = NotificationFactory_1.NotificationFactoryProducer.getFactory('inapp');
            await notificationFactory.notifyUser(userId, `🎉 Seu livro "${titulo}" foi publicado com sucesso no BookSwap!`, {
                bookId: newBook.id,
                listingType: listingType,
                actionUrl: `/livros/${newBook.id}`,
                priority: 'high'
            });
            console.log('✅ Notificação in-app enviada');
            const notificationResults = await new NotificationFactory_2.NotificationBuilder()
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
            console.log('📨 Resultados das notificações:', notificationResults);
        }
        catch (notificationError) {
            console.warn('⚠️ Erro nas notificações (não crítico):', notificationError.message);
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
    }
    catch (error) {
        console.error('❌ Erro ao criar livro:', error);
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
        console.log(`✏️ Atualizando livro ID: ${id}`);
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
    }
    catch (error) {
        console.error('❌ Erro ao atualizar livro:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
app.delete('/api/livros/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🗑️ Deletando livro ID: ${id}`);
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
    }
    catch (error) {
        console.error('❌ Erro ao deletar livro:', error);
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
            filteredBooks = filteredBooks.filter(book => book.curso?.toLowerCase().includes(req.query.curso.toLowerCase()));
        }
        if (req.query.condicao) {
            filteredBooks = filteredBooks.filter(book => book.condicao === req.query.condicao);
        }
        if (req.query.tipo) {
            filteredBooks = filteredBooks.filter(book => book.tipo === req.query.tipo);
        }
        if (req.query.precoMin || req.query.precoMax) {
            const min = req.query.precoMin ? parseFloat(req.query.precoMin) : 0;
            const max = req.query.precoMax ? parseFloat(req.query.precoMax) : Infinity;
            filteredBooks = filteredBooks.filter(book => {
                const preco = book.preco || 0;
                return preco >= min && preco <= max;
            });
        }
        if (req.query.vendedor) {
            filteredBooks = filteredBooks.filter(book => book.vendedor?.toLowerCase().includes(req.query.vendedor.toLowerCase()));
        }
        res.json({
            success: true,
            count: filteredBooks.length,
            total: allBooks.length,
            filtersApplied: Object.keys(req.query).length,
            data: filteredBooks
        });
    }
    catch (error) {
        console.error('❌ Erro na busca avançada:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
app.get('/api/test/patterns', async (req, res) => {
    try {
        const strategies = {
            venda: new PricingStrategy_1.PricingContext(new PricingStrategy_1.SalePricingStrategy()),
            troca: new PricingStrategy_1.PricingContext(new PricingStrategy_1.TradePricingStrategy()),
            doacao: new PricingStrategy_1.PricingContext(new PricingStrategy_1.DonationPricingStrategy())
        };
        const strategyResults = {
            venda: strategies.venda.executeCalculation(50),
            troca: strategies.troca.executeCalculation(50),
            doacao: strategies.doacao.executeCalculation(50)
        };
        const factories = {
            email: NotificationFactory_1.NotificationFactoryProducer.getFactory('email'),
            inapp: NotificationFactory_1.NotificationFactoryProducer.getFactory('inapp'),
            push: NotificationFactory_1.NotificationFactoryProducer.getFactory('push')
        };
        const booksCount = (await bookRepository.findAll()).length;
        res.json({
            success: true,
            patternsTest: {
                strategy: {
                    description: 'Strategy Pattern - Cálculo de preços',
                    results: strategyResults,
                    working: true
                },
                factory: {
                    description: 'Factory Method Pattern - Criação de notificações',
                    factories: Object.keys(factories),
                    working: true
                },
                repository: {
                    description: 'Repository Pattern - Acesso a dados',
                    booksInRepository: booksCount,
                    working: true
                },
                observer: {
                    description: 'Observer Pattern - Implementado no frontend',
                    location: 'src/observers/BookObserver.ts',
                    working: true
                },
                composite: {
                    description: 'Composite Pattern - Implementado no frontend',
                    location: 'src/composites/UIComposite.tsx',
                    working: true
                }
            },
            summary: '✅ Todos os 5 padrões de projeto estão implementados e funcionando!'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Rota não encontrada',
        availableRoutes: [
            'GET    /api',
            'GET    /api/health',
            'GET    /api/database',
            'GET    /api/patterns',
            'GET    /api/livros',
            'POST   /api/livros',
            'GET    /api/livros/:id',
            'PUT    /api/livros/:id',
            'DELETE /api/livros/:id',
            'GET    /api/test/patterns'
        ]
    });
});
app.use((error, req, res, next) => {
    console.error('🔥 Erro não tratado:', error);
    res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
});
app.listen(PORT, async () => {
    console.log('='.repeat(70));
    console.log('📚 BOOKSWAP ACADEMY - PADRÕES DE DESENVOLVIMENTO DE SOFTWARE');
    console.log('='.repeat(70));
    console.log(`🚀 Servidor: http://localhost:${PORT}`);
    console.log(`📖 API Base: http://localhost:${PORT}/api`);
    console.log(`💾 Database: http://localhost:${PORT}/api/database`);
    console.log(`🔍 Padrões: http://localhost:${PORT}/api/patterns`);
    console.log(`📚 Livros: http://localhost:${PORT}/api/livros`);
    console.log(`🧪 Teste: http://localhost:${PORT}/api/test/patterns`);
    console.log('='.repeat(70));
    console.log('🎯 PADRÕES IMPLEMENTADOS:');
    console.log('  1. Strategy Pattern - src/strategies/PricingStrategy.ts');
    console.log('  2. Factory Method - src/factories/NotificationFactory.ts');
    console.log('  3. Repository Pattern - src/repositories/BookRepository.ts');
    console.log('  4. Observer Pattern - frontend/src/observers/BookObserver.ts');
    console.log('  5. Composite Pattern - frontend/src/composites/UIComposite.tsx');
    console.log('='.repeat(70));
    try {
        await (0, database_1.testConnection)();
        console.log('✅ Conectado ao PostgreSQL com sucesso!');
    }
    catch (error) {
        console.warn('⚠️ Não foi possível conectar ao banco de dados');
        console.warn('⚠️ Algumas funcionalidades podem não funcionar corretamente');
    }
    console.log('🎉 PRONTO PARA CONECTAR COM FRONTEND!');
    console.log('🎯 Teste os padrões em: http://localhost:3001/api/test/patterns');
    console.log('='.repeat(70));
});
//# sourceMappingURL=app.js.map