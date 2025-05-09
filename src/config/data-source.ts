import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT, 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  poolSize: process.env.POSTGRES_POOL_SIZE
    ? parseInt(process.env.POSTGRES_POOL_SIZE, 10)
    : 10,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/database-migrations/*.js'],
  migrationsTableName: 'migrations_changelog',
  ssl: {
    rejectUnauthorized: false,
  },
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
