import express, { Response, Request, NextFunction } from 'express';
import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from '../api';
import { ILocals } from '../core';
import AppConfig from '../modules/app-config.module';
import { middleware as httpContextMiddleware } from 'express-http-context';
import generalSetupMiddleware from '../api/middlewares/general-setup.middleware';
import { HttpResponseError } from '../modules/http-response-error';
import path from 'path';
import musicListeningMiddleware from '../api/middlewares/music-listening-middleware';
require('express-async-errors');

export default (): express.Application => {
  const app = express();
  app.use((req, res, next) => {
    console.log(req.method + ' => ' + req.originalUrl);
    next();
  });
  app.use(musicListeningMiddleware);
  app.use(httpContextMiddleware);

  app.disable('x-powered-by');
  app.use(express.static(path.join('./musiques')));
  app.use(cors({ origin: process.env.FRONT_URL ?? '' }));
  app.use((req: Request, res: Response<any, ILocals>, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization',
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Expose-Headers', 'Content-disposition, filename');
    next();
  });
  app.use(urlencoded({ extended: true }));
  app.use(json());
  app.use(cookieParser());
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  app.use(require('helmet')());
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  app.use(require('compression')());

  app.use(generalSetupMiddleware);

  app.use(AppConfig.config.api.prefix, routes());

  app.use((error: Error, req: Request, res: Response<unknown, ILocals>, _next: NextFunction) => {
    console.error(error);
    HttpResponseError.sendError(error, req, res);
  });

  app
    .listen(AppConfig.config.app.port, () => {
      console.log(
        `
      ###############################################
      🛡️      Server listening on port: ${AppConfig.config.app.port}      🛡️
      ###############################################`,
      );
    })
    .on('error', (err) => {
      console.error(err);
      process.exit(1);
    });

  return app;
};
