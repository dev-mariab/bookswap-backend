'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    class Book extends Model {
        static associate(models) {
            Book.belongsTo(models.Usuario, {
                foreignKey: 'userId',
                as: 'usuario'
            });
        }
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
        }
    }, {
        sequelize,
        modelName: 'Book',
        tableName: 'Books'
    });
    return Book;
};
//# sourceMappingURL=Book.js.map