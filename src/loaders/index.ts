import expressLoader from './api.loader';
import postgresLoader from './database.loader';
import { Sequelize } from 'sequelize/types';

export default async (): Promise<Sequelize> => {
  const postgressConnection = await postgresLoader();

  expressLoader();

  return postgressConnection;
};
