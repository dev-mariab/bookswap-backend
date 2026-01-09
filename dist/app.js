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
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/api', (req, res) => {
    res.json({
        projeto: 'BookSwap Academy',
        aluno: 'Seu Nome',
        disciplina: 'Padrões de Desenvolvimento de Software',
        status: 'API funcionando!',
        endpoints: {
            health: '/api/health',
            database: '/api/database',
            livros: '/api/livros',
            test: '/api/test-table'
        }
    });
});
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        timestamp: new Date().toISOString(),
        message: 'BookSwap API está rodando perfeitamente!'
    });
});
app.get('/api/database', async (req, res) => {
    const isConnected = await (0, database_1.testConnection)();
    if (isConnected) {
        res.json({
            status: 'connected',
            database: 'PostgreSQL',
            details: {
                host: 'localhost',
                port: 5432,
                name: 'aplicacao_pds',
                user: 'postgres'
            }
        });
    }
    else {
        res.status(500).json({
            status: 'disconnected',
            error: 'Não foi possível conectar ao banco'
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
app.get('/api/livros', (req, res) => {
    const livros = [
        {
            id: '1',
            titulo: 'Cálculo Vol. 1',
            autor: 'James Stewart',
            preco: 45.50,
            condicao: 'quase_novo',
            imagem: 'https://m.media-amazon.com/images/I/81C5El+-h2L._AC_UF1000,1000_QL80_.jpg',
            vendedor: 'Maria Silva',
            avaliacao: 4.8,
            localizacao: 'Campus Central'
        },
        {
            id: '2',
            titulo: 'Física para Universitários',
            autor: 'David Halliday',
            preco: 68.90,
            condicao: 'bom',
            imagem: 'https://m.media-amazon.com/images/I/81wgcld4wxL._AC_UF1000,1000_QL80_.jpg',
            vendedor: 'João Santos',
            avaliacao: 4.5,
            localizacao: 'Campus Norte'
        },
        {
            id: '3',
            titulo: 'Química Geral',
            autor: 'John C. Kotz',
            preco: 55.00,
            condicao: 'novo',
            imagem: 'https://m.media-amazon.com/images/I/81C5El+-h2L._AC_UF1000,1000_QL80_.jpg',
            vendedor: 'Ana Oliveira',
            avaliacao: 4.9,
            localizacao: 'Campus Leste'
        }
    ];
    setTimeout(() => {
        res.json({
            success: true,
            count: livros.length,
            data: livros
        });
    }, 300);
});
app.listen(PORT, async () => {
    console.log('='.repeat(60));
    console.log('BOOKSWAP ACADEMY - PDS');
    console.log('='.repeat(60));
    console.log(`Servidor: http://localhost:${PORT}`);
    console.log(`API Base: http://localhost:${PORT}/api`);
    console.log(`Database: http://localhost:${PORT}/api/database`);
    console.log(`Livros: http://localhost:${PORT}/api/livros`);
    console.log('='.repeat(60));
    await (0, database_1.testConnection)();
    console.log('PRONTO PARA CONECTAR COM FRONTEND!');
    console.log('='.repeat(60));
});
//# sourceMappingURL=app.js.map