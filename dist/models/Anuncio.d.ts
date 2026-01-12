import { Model } from 'sequelize';
declare class Anuncio extends Model {
    id: string;
    titulo: string;
    descricao: string;
    preco: number;
    condicao: string;
    tipo: string;
    fotos: any;
    livroId: string;
    usuarioId: string;
    readonly criado_em: Date;
    readonly atualizado_em: Date;
}
export { Anuncio };
//# sourceMappingURL=Anuncio.d.ts.map