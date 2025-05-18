import { Router } from 'express';
import userController from '../controllers/user.controller';
import auth from '../middlewares/auth';

const route = Router();

export const UserRouter = (app: Router): Router => {
  app.use('/user', route);

  route.get('/me', auth, userController.me);

  route.get('/all', auth, userController.all);

  route.post('/sync', auth, userController.updateDiscord);

  route.post('/', auth, userController.update);

  return route;
};
