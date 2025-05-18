/* eslint-disable prefer-rest-params */
import * as config from '../config/index';
import { Sequelize } from 'sequelize-typescript';

export default class AppConfig {
  public static process = {
    start: new Date(),
    sequelizeReady: false,
    env: (process.env.NODE_ENV || '').toLowerCase(),
  };

  public static sequelize: Sequelize;
  public static config = config.default;
}
