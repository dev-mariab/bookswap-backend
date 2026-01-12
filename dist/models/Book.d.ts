import { Model } from 'sequelize';
import { Usuario } from './Usuario';
declare class Book extends Model {
    id: string;
    title: string;
    author: string;
    description: string;
    status: string;
    userId: string;
    curso: string;
    condicao: string;
    tipo: string;
    preco: number;
    vendedor: string;
    imagem: string;
    avaliacao: number;
    localizacao: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly usuario?: Usuario;
}
export { Book };
//# sourceMappingURL=Book.d.ts.map