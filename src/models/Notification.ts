import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Notification extends Model {
  public id!: number;
  public userId!: string;
  public message!: string;
  public type!: 'email' | 'push' | 'in_app';
  public metadata!: any;
  public read!: boolean;
  public createdAt!: Date;
  public readAt?: Date;
}

Notification.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('email', 'push', 'in_app'),
    allowNull: false
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  readAt: {
    type: DataTypes.DATE
  }
}, {
  sequelize,
  tableName: 'notifications',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: false
});

export { Notification };