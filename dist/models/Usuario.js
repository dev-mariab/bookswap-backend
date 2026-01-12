"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuario = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Usuario extends sequelize_1.Model {
}
exports.Usuario = Usuario;
Usuario.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    email: {
        type: sequelize_1.DataTypes.STRING(255),
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    primeiro_nome: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false
    },
    sobrenome: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false
    },
    hash_senha: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    avaliacao_geral: {
        type: sequelize_1.DataTypes.DECIMAL(3, 2),
        defaultValue: 0.0
    },
    status_conta: {
        type: sequelize_1.DataTypes.ENUM('ativo', 'inativo', 'suspenso', 'banido'),
        defaultValue: 'ativo'
    }
}, {
    sequelize: database_1.default,
    modelName: 'Usuario',
    tableName: 'Usuarios',
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em'
});
//# sourceMappingURL=Usuario.js.map