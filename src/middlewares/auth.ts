import { Request, Response, NextFunction } from 'express';
import { AuthUtils } from '../utils/Auth';
import { Usuario } from '../models/Usuario';

export interface AuthRequest extends Request {
  user?: any;
  userId?: string;
}

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