import { Router } from 'express';
import auth from '../middlewares/auth';
import musicianController from '../controllers/musician.controller';

const route = Router();

export const MusicianRouter = (app: Router): Router => {
  app.use('/musician', route);

  route.post('/create', auth, musicianController.create);

  route.post('/update', auth, musicianController.update);

  route.delete('/delete', auth, musicianController.delete);

  route.get('/get-all', musicianController.getAll);

  return route;
};
