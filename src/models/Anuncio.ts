import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { Usuario } from './Usuario';

class Anuncio extends Model {
  public id!: string;
  public titulo!: string;
  public descricao!: string;
  public preco!: number;
  public condicao!: string;
  public tipo!: string;
  public fotos!: any;
  public livroId!: string;
  public usuarioId!: string;
  public readonly criado_em!: Date;
  public readonly atualizado_em!: Date;
}

Anuncio.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  titulo: DataTypes.STRING,
  descricao: DataTypes.TEXT,
  preco: DataTypes.DECIMAL,
  condicao: DataTypes.STRING,
  tipo: DataTypes.STRING,
  fotos: DataTypes.JSON,
  livroId: DataTypes.UUID,
  usuarioId: DataTypes.UUID
}, {
  sequelize,
  modelName: 'Anuncio',
});

export { Anuncio };
