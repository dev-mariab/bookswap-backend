'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Livros', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      titulo: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      autor: {
        type: Sequelize.STRING(100),
      },
      editora: {
        type: Sequelize.STRING(100),
      },
      isbn: {
        type: Sequelize.STRING(20),
      },
      ano: {
        type: Sequelize.INTEGER,
      },
      preco: {
        type: Sequelize.DECIMAL(10, 2),
      },
      tipo: {
        type: Sequelize.ENUM('venda', 'troca', 'doacao'),
        defaultValue: 'venda',
      },
      condicao: {
        type: Sequelize.ENUM('novo', 'quase_novo', 'bom', 'aceitavel', 'ruim'),
        defaultValue: 'bom',
      },
      descricao: {
        type: Sequelize.TEXT,
      },
      curso_relacionado: {
        type: Sequelize.STRING(100),
      },
      fotos: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: [],
      },
      userId: {
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Livros');
  }
};