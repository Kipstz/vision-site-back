import { Router } from 'express';
import auth from '../middlewares/auth';
import patchNoteController from '../controllers/patch-note.controller';

const route = Router();

export const PatchNoteRouter = (app: Router): Router => {
  app.use('/patch-note', route);

  route.post('/create', auth, patchNoteController.create);

  route.post('/update', auth, patchNoteController.update);

  route.delete('/delete', auth, patchNoteController.delete);

  route.get('/last', patchNoteController.getLasts);

  route.get('/', auth, patchNoteController.get);

  route.get('/get-all', auth, patchNoteController.getAll);

  return route;
};
