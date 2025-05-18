import AppConfig from './modules/app-config.module';

export async function startServer(): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  AppConfig.sequelize = await require('./loaders').default();
}
