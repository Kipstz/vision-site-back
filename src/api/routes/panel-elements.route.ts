import { Router } from 'express';
import auth from '../middlewares/auth';
import panelElementsController from '../controllers/panel-elements.controller';

const route = Router();

export const PanelElementsRouter = (app: Router): Router => {
  app.use('/panel-element', route);

  route.post('/create', auth, panelElementsController.create);

  route.post('/update', auth, panelElementsController.update);

  route.delete('/delete', auth, panelElementsController.delete);

  route.get('/get-all', panelElementsController.getAll);

  return route;
};
