import { Router } from 'express';
import auth from '../middlewares/auth';
import bestOfController from '../controllers/best-of.controller';

const route = Router();

export const bestOfRouter = (app: Router): Router => {
  app.use('/best-of', route);

  route.post('/create', auth, bestOfController.create);

  route.post('/update', auth, bestOfController.update);

  route.delete('/delete', auth, bestOfController.delete);

  route.get('/last', bestOfController.getLasts);

  route.get('/', auth, bestOfController.get);

  route.get('/get-all', auth, bestOfController.getAll);

  return route;
};
