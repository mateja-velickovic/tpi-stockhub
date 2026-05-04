import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const sequelize = new Sequelize(
  process.env.DB_NAME || 'stockhub',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
  }
);

export default sequelize;
