import { Router } from 'express';
import eventController from '../controllers/event.controller';
import auth from '../middlewares/auth';

const route = Router();

export const EventRouter = (app: Router): Router => {
  app.use('/event', route);

  route.post('/create', auth, eventController.create);

  route.post('/update', auth, eventController.update);

  route.delete('/delete', auth, eventController.delete);

  // route.get('/', eventController.get);

  route.post('/get-by-date', eventController.getByDate);

  route.get('/get-all', auth, eventController.getAll);

  return route;
};
