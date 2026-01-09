import express from 'express';
import cors from 'cors';
import { testConnection } from './config/database';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  const isConnected = await testConnection();
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
  } else {
    res.status(500).json({
      status: 'disconnected',
      error: 'Não foi possível conectar ao banco'
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

app.post('/api/livros', async (req, res) => {
  console.log('Recebida requisição POST para /api/livros');
  console.log('Dados recebidos:', req.body);
  
  try {
    
    const novoLivro = {
      id: Date.now().toString(), 
      ...req.body,
      criadoEm: new Date().toISOString(),
      avaliacao: req.body.avaliacao || 4.5,
      localizacao: req.body.localizacao || 'Campus Central'
    };
    
    console.log('Livro criado:', novoLivro);
    
    res.status(201).json({
      success: true,
      message: 'Livro criado com sucesso!',
      data: novoLivro
    });
    
  } catch (error: any) {
    console.error('Erro ao criar livro:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Erro ao criar livro'
    });
  }
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
  
  await testConnection();
  
  console.log('PRONTO PARA CONECTAR COM FRONTEND!');
  console.log('='.repeat(60));
});