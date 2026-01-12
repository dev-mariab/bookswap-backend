import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { Usuario } from './Usuario';

class Book extends Model {
  public id!: string;
  public title!: string;
  public author!: string;
  public description!: string;
  public status!: string;
  public userId!: string;
  public curso!: string;
  public condicao!: string;
  public tipo!: string;
  public preco!: number;
  public vendedor!: string;
  public imagem!: string;
  public avaliacao!: number;
  public localizacao!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly usuario?: Usuario;
}

Book.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'available'
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Usuarios',
      key: 'id'
    }
  },
  curso: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Engenharia'
  },
  condicao: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'bom'
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'venda'
  },
  preco: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  vendedor: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Usuário BookSwap'
  },
  imagem: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  avaliacao: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: false,
    defaultValue: 5.0
  },
  localizacao: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Campus Central'
  }
}, {
  sequelize,
  modelName: 'Book',
  tableName: 'Books'
});

export { Book };
