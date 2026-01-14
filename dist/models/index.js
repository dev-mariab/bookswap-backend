"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = exports.Anuncio = exports.Book = exports.Usuario = void 0;
const database_1 = __importDefault(require("../config/database"));
const User_1 = require("./User");
Object.defineProperty(exports, "Usuario", { enumerable: true, get: function () { return User_1.Usuario; } });
const Book_1 = require("./Book");
Object.defineProperty(exports, "Book", { enumerable: true, get: function () { return Book_1.Book; } });
const Anuncio_1 = require("./Anuncio");
Object.defineProperty(exports, "Anuncio", { enumerable: true, get: function () { return Anuncio_1.Anuncio; } });
const Notification_1 = require("./Notification");
Object.defineProperty(exports, "Notification", { enumerable: true, get: function () { return Notification_1.Notification; } });
const db = {
    sequelize: database_1.default,
    Usuario: User_1.Usuario,
    Book: Book_1.Book,
    Anuncio: Anuncio_1.Anuncio,
    Notification: Notification_1.Notification
};
User_1.Usuario.hasMany(Book_1.Book, { foreignKey: 'userId', as: 'books' });
Book_1.Book.belongsTo(User_1.Usuario, { foreignKey: 'userId', as: 'usuario' });
Anuncio_1.Anuncio.belongsTo(User_1.Usuario, { foreignKey: 'usuarioId' });
exports.default = db;
//# sourceMappingURL=index.js.map