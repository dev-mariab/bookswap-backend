import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { Book } from './Book';

class Usuario extends Model {
  public id!: string;
  public email!: string;
  public primeiro_nome!: string;
  public sobrenome!: string;
  public hash_senha!: string;
  public avaliacao_geral!: number;
  public status_conta!: 'ativo' | 'inativo' | 'suspenso' | 'banido';
  public readonly criado_em!: Date;
  public readonly atualizado_em!: Date;

  public readonly books?: Book[];
}

Usuario.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  primeiro_nome: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  sobrenome: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  hash_senha: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  avaliacao_geral: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0.0
  },
  status_conta: {
    type: DataTypes.ENUM('ativo', 'inativo', 'suspenso', 'banido'),
    defaultValue: 'ativo'
  }
}, {
  sequelize,
  modelName: 'Usuario',
  tableName: 'Usuarios',
  timestamps: true,
  createdAt: 'criado_em',
  updatedAt: 'atualizado_em'
});

export { Usuario };
