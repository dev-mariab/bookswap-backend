import fs from 'fs';
import path from 'path';
import sequelize from '../config/database';
import { DataTypes } from 'sequelize';

const db: any = {};
const basename = path.basename(__filename);

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      (file.slice(-3) === '.js' || file.slice(-3) === '.ts') &&
      file.indexOf('.test.') === -1
    );
  })
  .forEach(file => {
    const modelPath = path.join(__dirname, file);
    const modelImport = require(modelPath);
    const model = modelImport(sequelize, DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = require('sequelize');

export default db;
