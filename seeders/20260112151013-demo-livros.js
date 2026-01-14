'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Livros', [
      {
        id: 'd4e5f6a7-b8c9-0123-defg-456789012345',
        titulo: 'Cálculo I - James Stewart',
        autor: 'James Stewart',
        editora: 'Cengage Learning',
        isbn: '9788522112586',
        ano: 2017,
        preco: 75.50,
        tipo: 'venda',
        condicao: 'quase_novo',
        descricao: 'Livro de cálculo em ótimo estado, pouco uso.',
        curso_relacionado: 'Engenharia',
        fotos: ['https://images-na.ssl-images-amazon.com/images/I/71Q1XgxJ4pL.jpg'],
        userId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'e5f6a7b8-c9d0-1234-efgh-567890123456',
        titulo: 'Introdução à Programação com Python',
        autor: 'Nilo Ney',
        editora: 'Novatec',
        isbn: '9788575227183',
        ano: 2020,
        preco: 0.00,
        tipo: 'doacao',
        condicao: 'bom',
        descricao: 'Livro para iniciantes em programação Python.',
        curso_relacionado: 'Ciência da Computação',
        fotos: ['https://m.media-amazon.com/images/I/71nQ8ZkE-7L._AC_UF1000,1000_QL80_.jpg'],
        userId: 'b2c3d4e5-f6a7-8901-bcde-f23456789012',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'f6a7b8c9-d0e1-2345-fghi-678901234567',
        titulo: 'Banco de Dados - Fundamentos e Aplicações',
        autor: 'Carlos Alberto Heuser',
        editora: 'Bookman',
        isbn: '9788577807457',
        ano: 2019,
        preco: 60.00,
        tipo: 'troca',
        condicao: 'novo',
        descricao: 'Livro novo, ainda lacrado. Aceito troca por livro de redes.',
        curso_relacionado: 'Sistemas de Informação',
        fotos: ['https://images-na.ssl-images-amazon.com/images/I/71yJpBQ0QzL.jpg'],
        userId: 'c3d4e5f6-a7b8-9012-cdef-345678901234',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Livros', null, {});
  }
};