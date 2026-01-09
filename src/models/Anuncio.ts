'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Anuncio extends Model {
    static associate(models) {
      Anuncio.belongsTo(models.Usuario, { foreignKey: 'usuarioId' });
    }
  }
  
  Anuncio.init({
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
  
  return Anuncio;
};