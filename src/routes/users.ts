import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/UserRepository';
import { NotificationBuilder } from '../factories/NotificationFactory';
import { AuthUtils } from '../utils/Auth';
import { Usuario } from '../models';

const router = Router();
const repository = new UserRepository();

router.get('/', async (req, res) => {
  try {
    const usuarios = await repository.findAll();
    res.json({ success: true, data: usuarios });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Erro ao listar usuários' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const usuario = await repository.findById(req.params.id);

    if (!usuario) {
      return res.status(404).json({ success: false, error: 'Usuário não encontrado' });
    }

    res.json({ success: true, data: usuario });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Erro ao buscar usuário' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { email, senha, primeiro_nome, sobrenome } = req.body;

    const exists = await Usuario.findOne({ where: { email } });
    if (exists) {
      return res.status(400).json({ success: false, error: 'Email já cadastrado' });
    }

    const hash = await bcrypt.hash(senha, 10);
    const novo = await repository.create({
      email,
      hash_senha: hash,
      primeiro_nome,
      sobrenome,
    } as any);

    await new NotificationBuilder()
      .setUserId(novo.id)
      .setMessage('Seja bem-vindo ao BookSwap Academy!')
      .setTypes(['email', 'inapp'])
      .buildAndSend();

    res.status(201).json({ success: true, data: novo });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Erro ao registrar usuário' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const usuario = await repository.update(req.params.id, req.body);

    if (!usuario) {
      return res.status(404).json({ success: false, error: 'Usuário não encontrado' });
    }

    await new NotificationBuilder()
      .setUserId(usuario.id)
      .setMessage('Seu perfil foi atualizado com sucesso.')
      .setTypes(['inapp'])
      .buildAndSend();

    res.json({ success: true, data: usuario });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Erro ao atualizar usuário' });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const deleted = await repository.delete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Usuário não encontrado' });
    }

    await new NotificationBuilder()
      .setUserId(req.params.id)
      .setMessage('Sua conta foi removida do BookSwap Academy.')
      .setTypes(['email'])
      .setPriority('high')
      .buildAndSend();

    res.json({ success: true, data: { message: 'Usuário removido com sucesso' } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Erro ao remover usuário' });
  }
});

export default router;