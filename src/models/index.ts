import sequelize from '../config/database';
import { Usuario } from './Usuario';
import { Book } from './Livro';
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

Usuario.hasMany(Anuncio, { foreignKey: 'usuarioId', as: 'anuncios' });
Anuncio.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

export default db;
export { Usuario, Book, Anuncio, Notification };