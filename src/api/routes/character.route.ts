import { Router } from 'express';
import auth from '../middlewares/auth';
import characterController from '../controllers/character.controller';

const route = Router();

export const CharacterRouter = (app: Router): Router => {
  app.use('/character', route);

  route.post('/create', auth, characterController.create);

  route.post('/update', auth, characterController.update);

  route.delete('/delete', auth, characterController.delete);

  route.get('/get-all', auth, characterController.getAll);

  route.get('/get-by-job', auth, characterController.getByJob);

  return route;
};
