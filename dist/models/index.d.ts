import { Usuario } from './User';
import { Book } from './Book';
import { Anuncio } from './Anuncio';
import { Notification } from './Notification';
declare const db: {
    sequelize: import("sequelize").Sequelize;
    Usuario: typeof Usuario;
    Book: typeof Book;
    Anuncio: typeof Anuncio;
    Notification: typeof Notification;
};
export default db;
export { Usuario, Book, Anuncio, Notification };
//# sourceMappingURL=index.d.ts.map