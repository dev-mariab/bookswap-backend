"use strict";
export {};
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize: any) => {
  class Usuario extends Model {
    static associate(models: any) {
      Usuario.hasMany(models.Book, {
        foreignKey: 'userId',
        as: 'books'
      });
    }
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
  
  return Usuario;
};