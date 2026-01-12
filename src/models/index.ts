import sequelize from '../config/database';
import { Usuario } from './Usuario';
import { Book } from './Book';
import { Anuncio } from './Anuncio';
import { Notification } from './Notification';

const db = {
  sequelize,
  Usuario,
  Book,
  Anuncio,
  Notification
};

Usuario.hasMany(Book, { foreignKey: 'userId', as: 'books' });
Book.belongsTo(Usuario, { foreignKey: 'userId', as: 'usuario' });
Anuncio.belongsTo(Usuario, { foreignKey: 'usuarioId' });

export default db;
export { Usuario, Book, Anuncio, Notification };
