"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Notification extends sequelize_1.Model {
}
exports.Notification = Notification;
Notification.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    type: {
        type: sequelize_1.DataTypes.ENUM('email', 'push', 'in_app'),
        allowNull: false
    },
    metadata: {
        type: sequelize_1.DataTypes.JSON,
        defaultValue: {}
    },
    read: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    readAt: {
        type: sequelize_1.DataTypes.DATE
    }
}, {
    sequelize: database_1.default,
    tableName: 'notifications',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: false
});
//# sourceMappingURL=Notification.js.map