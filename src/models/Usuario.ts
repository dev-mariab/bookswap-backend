import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface UsuarioAttributes {
  id: string;
  email: string;
  primeiro_nome: string;
  sobrenome: string;
  nome_exibicao?: string;
  hash_senha: string;
  avaliacao_geral: number;
  status_conta: string;
}

interface UsuarioCreationAttributes extends Optional<UsuarioAttributes, 'id'> {}

class Usuario extends Model<UsuarioAttributes, UsuarioCreationAttributes> 
  implements UsuarioAttributes {
  
  public id!: string;
  public email!: string;
  public primeiro_nome!: string;
  public sobrenome!: string;
  public nome_exibicao?: string;
  public hash_senha!: string;
  public avaliacao_geral!: number;
  public status_conta!: string;

  public readonly criado_em!: Date;
  public readonly atualizado_em!: Date;
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
  nome_exibicao: {
    type: DataTypes.VIRTUAL,
    get() {
      return `${this.primeiro_nome} ${this.sobrenome.charAt(0)}.`;
    }
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
  tableName: 'usuarios',
  timestamps: true,
  createdAt: 'criado_em',
  updatedAt: 'atualizado_em'
});

export default Usuario;