import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASSWORD!,
  {
    host: process.env.DB_HOST || 'localhost',
    port: 5432, 
    dialect: 'postgres',
    logging: (msg) => console.log(`[DB] ${msg}`),
    dialectOptions: {
      ssl: false
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

let connectionTested = false;

export const testConnection = async () => {
  if (!connectionTested) {
    try {
      await sequelize.authenticate();
      console.log('='.repeat(50));
      console.log('CONEXÃO COM POSTGRESQL ESTABELECIDA!');
      console.log(`Banco: ${process.env.DB_NAME}`);
      console.log(`Usuário: ${process.env.DB_USER}`);
      console.log(`Porta: 5432`);
      console.log('='.repeat(50));
      connectionTested = true;
      return true;
    } catch (error: any) {
      console.error('ERRO DE CONEXÃO:', error.message);
      console.log('Verifique:');
      console.log('  1. PostgreSQL está rodando?');
      console.log('  2. pgAdmin → Servidor "PostgreSQL 15" está online?');
      console.log('  3. Senha "2003" está correta?');
      return false;
    }
  }
  return true;
};

export default sequelize;