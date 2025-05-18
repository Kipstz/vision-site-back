import { Sequelize } from 'sequelize-typescript';
import AppConfig from '../modules/app-config.module';
import path from 'path';
import { requireModules } from '../utils/import.utils';

export default async (): Promise<Sequelize> => {
  const database = AppConfig.config.database;

  return new Promise(async (resolve) => {
    try {
      const connection = new Sequelize(database.database, database.username, database.password, {
        host: database.host,
        password: database.password,
        port: database.port,
        dialect: database.dialect,
        models: requireModules(path.join(__dirname, '../database/models')),
        logging: false,
        logQueryParameters: true,
        pool: {
          max: 10,
          min: 0,
          idle: 10000,
          acquire: 30000,
        },
      });
      await connection.authenticate();

      await connection.sync({ alter: true, force: false });

      await Promise.all([
        // connection.query('CREATE TABLE IF NOT EXISTS "SequelizeData" (name VARCHAR(255));'),
        // connection.query('CREATE TABLE IF NOT EXISTS "SequelizeMeta" (name VARCHAR(255));'),
      ]);

      AppConfig.sequelize = connection;

      AppConfig.process.sequelizeReady = true;

      resolve(connection);
    } catch (error: any) {
      console.error(error);
    }
  });
};
