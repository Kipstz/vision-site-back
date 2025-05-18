import { Router } from 'express';
import authController from '../controllers/auth.controller';

const route = Router();

export const AuthRouter = (app: Router): Router => {
  app.use('/auth', route);

  route.post('/oauth', authController.oauth);

  return route;
};
