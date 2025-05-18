import { Router } from 'express';
import auth from '../middlewares/auth';
import musicController from '../controllers/music.controller';
import multer from 'multer';
import facultativeAuth from '../middlewares/facultative-auth';

const route = Router();
const upload = multer();

export const MusicRouter = (app: Router): Router => {
  app.use('/music', route);

  route.post('/create', auth, musicController.create);

  route.post('/upload/:musicianId/:musicId', auth, upload.single('music'), musicController.upload);

  route.post('/update', auth, musicController.update);

  route.delete('/delete', auth, musicController.delete);

  route.get('/get-all', facultativeAuth, musicController.getAll);

  route.get('/get-by-musician', musicController.getByMusicianId);

  route.post('/update-favorite', auth, musicController.updateFavorite);

  return route;
};
