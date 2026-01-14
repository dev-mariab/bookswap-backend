"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuthenticate = exports.authenticate = void 0;
const Auth_1 = require("../utils/Auth");
const User_1 = require("../models/User");
const authenticate = async (req, res, next) => {
    try {
        const token = Auth_1.AuthUtils.extractToken(req.headers.authorization);
        if (!token) {
            res.status(401).json({
                error: 'Token de autenticação não fornecido'
            });
            return;
        }
        const decoded = Auth_1.AuthUtils.verifyToken(token);
        if (!decoded) {
            res.status(401).json({
                error: 'Token inválido ou expirado'
            });
            return;
        }
        const user = await User_1.Usuario.findByPk(decoded.userId, {
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
    }
    catch (error) {
        console.error('Erro na autenticação:', error);
        res.status(500).json({
            error: 'Erro interno no servidor de autenticação'
        });
    }
};
exports.authenticate = authenticate;
const optionalAuthenticate = async (req, res, next) => {
    try {
        const token = Auth_1.AuthUtils.extractToken(req.headers.authorization);
        if (token) {
            const decoded = Auth_1.AuthUtils.verifyToken(token);
            if (decoded) {
                const user = await User_1.Usuario.findByPk(decoded.userId, {
                    attributes: { exclude: ['senha'] }
                });
                if (user) {
                    req.user = user;
                    req.userId = decoded.userId;
                }
            }
        }
        next();
    }
    catch (error) {
        next();
    }
};
exports.optionalAuthenticate = optionalAuthenticate;
//# sourceMappingURL=auth.js.map