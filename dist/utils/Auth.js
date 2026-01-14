"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUtils = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const JWT_SECRET = process.env.JWT_SECRET || 'bookswap_pds_2024_faculdade_segredo';
const JWT_EXPIRES_IN = '7d';
class AuthUtils {
    static generateToken(userId, email) {
        return jsonwebtoken_1.default.sign({ userId, email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    }
    static verifyToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, JWT_SECRET);
        }
        catch (error) {
            return null;
        }
    }
    static async hashPassword(password) {
        return await bcryptjs_1.default.hash(password, 10);
    }
    static async comparePassword(password, hash) {
        return await bcryptjs_1.default.compare(password, hash);
    }
    static extractToken(authHeader) {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }
        return authHeader.split(' ')[1];
    }
}
exports.AuthUtils = AuthUtils;
//# sourceMappingURL=Auth.js.map