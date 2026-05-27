import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });


const dbPort =
  process.env.NODE_ENV === 'staging' || process.env.VITE_ENV === 'staging'
    ? parseInt(process.env.ST_DB_PORT)
    : parseInt(process.env.DB_PORT || '3306');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'stockhub',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    port: dbPort,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
  }
);

export default sequelize;
