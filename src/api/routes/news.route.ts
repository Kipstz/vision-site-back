import { Router } from 'express';
import auth from '../middlewares/auth';
import newsController from '../controllers/news.controller';

const route = Router();

export const NewsRouter = (app: Router): Router => {
  app.use('/news', route);

  route.post('/create', auth, newsController.create);

  route.post('/update', auth, newsController.update);

  route.delete('/delete', auth, newsController.delete);

  route.get('/last', newsController.getLasts);

  route.get('/get-all', auth, newsController.getAll);

  route.get('/', newsController.get);

  return route;
};
