import { Model } from 'sequelize';
import { Book } from './Book';
declare class Usuario extends Model {
    id: string;
    email: string;
    primeiro_nome: string;
    sobrenome: string;
    hash_senha: string;
    avaliacao_geral: number;
    status_conta: 'ativo' | 'inativo' | 'suspenso' | 'banido';
    readonly criado_em: Date;
    readonly atualizado_em: Date;
    readonly books?: Book[];
}
export { Usuario };
//# sourceMappingURL=User.d.ts.map