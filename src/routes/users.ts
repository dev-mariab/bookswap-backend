import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/UserRepository';
import { NotificationBuilder } from '../factories/NotificationFactory';
import { AuthUtils } from '../utils/Auth';
import { Usuario } from '../models';
import { authenticate } from '../middlewares/auth';


const router = Router();
const repository = new UserRepository();


router.get('/', authenticate, async (req, res) => {
  const usuarios = await repository.findAll();
  res.json(usuarios);
});

router.get('/:id', authenticate, async (req, res) => {
  const usuario = await repository.findById(req.params.id);

  if (!usuario) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  res.json(usuario);
});

router.post('/register', async (req, res) => {
  const { email, senha, primeiro_nome, sobrenome } = req.body;

  const exists = await Usuario.findOne({ where: { email } });
  if (exists) {
    return res.status(400).json({ error: 'Email já cadastrado' });
  }

  const hash = await AuthUtils.hashPassword(senha);

  const usuario = await Usuario.create({
    email,
    primeiro_nome,
    sobrenome,
    hash_senha: hash
  });

  const token = AuthUtils.generateToken(usuario.id, usuario.email);

  res.status(201).json({ token });
});

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  const usuario = await Usuario.findOne({ where: { email } });
  if (!usuario) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  const senhaValida = await AuthUtils.comparePassword(
    senha,
    usuario.hash_senha
  );

  if (!senhaValida) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  const token = AuthUtils.generateToken(usuario.id, usuario.email);

  res.json({ token });
});

router.put('/:id', authenticate, async (req, res) => {
  const usuario = await repository.update(req.params.id, req.body);

  if (!usuario) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  await new NotificationBuilder()
    .setUserId(usuario.id)
    .setMessage('Seu perfil foi atualizado com sucesso.')
    .setTypes(['inapp'])
    .buildAndSend();

  res.json(usuario);
});

router.delete('/:id', authenticate, async (req, res) => {
  const deleted = await repository.delete(req.params.id);

  if (!deleted) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  await new NotificationBuilder()
    .setUserId(req.params.id)
    .setMessage('Sua conta foi removida do BookSwap Academy.')
    .setTypes(['email'])
    .setPriority('high')
    .buildAndSend();

  res.json({ message: 'Usuário removido com sucesso' });
});

export default router;
