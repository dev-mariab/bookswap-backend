"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Book extends sequelize_1.Model {
}
exports.Book = Book;
Book.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    author: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: sequelize_1.DataTypes.TEXT
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: 'available'
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Usuarios',
            key: 'id'
        }
    },
    curso: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Engenharia'
    },
    condicao: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'bom'
    },
    tipo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'venda'
    },
    preco: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    vendedor: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Usuário BookSwap'
    },
    imagem: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true
    },
    avaliacao: {
        type: sequelize_1.DataTypes.DECIMAL(3, 2),
        allowNull: false,
        defaultValue: 5.0
    },
    localizacao: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Campus Central'
    }
}, {
    sequelize: database_1.default,
    modelName: 'Book',
    tableName: 'Books'
});
//# sourceMappingURL=Book.js.map