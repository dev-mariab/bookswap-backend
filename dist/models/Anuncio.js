"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Anuncio = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Anuncio extends sequelize_1.Model {
}
exports.Anuncio = Anuncio;
Anuncio.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    titulo: sequelize_1.DataTypes.STRING,
    descricao: sequelize_1.DataTypes.TEXT,
    preco: sequelize_1.DataTypes.DECIMAL,
    condicao: sequelize_1.DataTypes.STRING,
    tipo: sequelize_1.DataTypes.STRING,
    fotos: sequelize_1.DataTypes.JSON,
    livroId: sequelize_1.DataTypes.UUID,
    usuarioId: sequelize_1.DataTypes.UUID
}, {
    sequelize: database_1.default,
    modelName: 'Anuncio',
});
//# sourceMappingURL=Anuncio.js.map