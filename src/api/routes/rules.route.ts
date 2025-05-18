import { Router } from 'express';
import auth from '../middlewares/auth';
import rulesController from '../controllers/rules.controller';

const route = Router();

export const RulesRouter = (app: Router): Router => {
  app.use('/rules', route);

  route.post('/', auth, rulesController.update);

  route.get('/', rulesController.get);

  return route;
};
