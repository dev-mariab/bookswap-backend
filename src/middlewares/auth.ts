import { Request, Response, NextFunction, Router } from 'express';
import { AuthUtils } from '../utils/Auth';
import { Usuario } from '../models/Usuario';

export interface AuthRequest extends Request {
  user?: any;
  userId?: string;
}

const router = Router();

router.post('/register', async (req, res) => {
  const { email, senha, primeiro_nome, sobrenome } = req.body;

  const existe = await Usuario.findOne({ where: { email } });
  if (existe) {
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

  res.status(201).json({
    token,
    usuario: {
      id: usuario.id,
      email: usuario.email,
      primeiro_nome: usuario.primeiro_nome,
      sobrenome: usuario.sobrenome
    }
  });
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

  res.json({
    token,
    usuario: {
      id: usuario.id,
      email: usuario.email,
      primeiro_nome: usuario.primeiro_nome,
      sobrenome: usuario.sobrenome
    }
  });
});


export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = AuthUtils.extractToken(req.headers.authorization);
    
    if (!token) {
      res.status(401).json({ 
        error: 'Token de autenticação não fornecido' 
      });
      return;
    }

    const decoded = AuthUtils.verifyToken(token);
    
    if (!decoded) {
      res.status(401).json({ 
        error: 'Token inválido ou expirado' 
      });
      return;
    }

    const user = await Usuario.findByPk(decoded.userId, {
      attributes: { exclude: ['hash_senha'] }
    });

    if (!user) {
      res.status(401).json({ 
        error: 'Usuário não encontrado' 
      });
      return;
    }

    req.user = user;
    req.userId = decoded.userId;
    
    next();
  } catch (error: any) {
    console.error('Erro na autenticação:', error);
    res.status(500).json({ 
      error: 'Erro interno no servidor de autenticação' 
    });
  }
};

export const optionalAuthenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = AuthUtils.extractToken(req.headers.authorization);
    
    if (token) {
      const decoded = AuthUtils.verifyToken(token);
      if (decoded) {
        const user = await Usuario.findByPk(decoded.userId, {
          attributes: { exclude: ['senha'] }
        });
        
        if (user) {
          req.user = user;
          req.userId = decoded.userId;
        }
      }
    }
    
    next();
  } catch (error) {
    next();
  }
};