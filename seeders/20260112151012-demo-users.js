'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    await queryInterface.bulkInsert('Users', [
      {
        id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        nome: 'João Silva',
        email: 'joao@bookswap.com',
        senha: hashedPassword,
        curso: 'Engenharia de Software',
        telefone: '(11) 99999-9999',
        avaliacao: 4.8,
        avatar: 'https://i.pravatar.cc/150?img=1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'b2c3d4e5-f6a7-8901-bcde-f23456789012',
        nome: 'Maria Santos',
        email: 'maria@bookswap.com',
        senha: hashedPassword,
        curso: 'Ciência da Computação',
        telefone: '(21) 98888-8888',
        avaliacao: 4.9,
        avatar: 'https://i.pravatar.cc/150?img=2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'c3d4e5f6-a7b8-9012-cdef-345678901234',
        nome: 'Carlos Oliveira',
        email: 'carlos@bookswap.com',
        senha: hashedPassword,
        curso: 'Administração',
        telefone: '(31) 97777-7777',
        avaliacao: 4.5,
        avatar: 'https://i.pravatar.cc/150?img=3',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};