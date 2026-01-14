import { Router } from 'express';
import { Book } from '../models/Livro';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const livros = await Book.findAll();
    res.json({
      success: true,
      count: livros.length,
      data: livros
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const livro = await Book.findByPk(req.params.id);
    if (!livro) {
      return res.status(404).json({
        success: false,
        error: 'Livro não encontrado'
      });
    }
    res.json({
      success: true,
      data: livro
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, author, preco, curso, condicao, tipo = 'venda' } = req.body;
    
    if (!title || !author) {
      return res.status(400).json({
        success: false,
        error: 'Título e autor são obrigatórios'
      });
    }
    
    const novoLivro = await Book.create({
      title,
      author,
      preco: preco || 0,
      curso: curso || 'Engenharia',
      condicao: condicao || 'bom',
      tipo,
      status: 'available',
      userId: 'user-temp', 
      vendedor: 'Usuário BookSwap',
      avaliacao: 5.0,
      localizacao: 'Campus Central'
    });
    
    res.status(201).json({
      success: true,
      message: 'Livro criado com sucesso!',
      data: novoLivro
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Book.destroy({
      where: { id: req.params.id }
    });
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Livro não encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Livro deletado com sucesso!'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;