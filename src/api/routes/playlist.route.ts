import { Router } from 'express';
import auth from '../middlewares/auth';
import playListController from '../controllers/playlist.controller';

const route = Router();

export const PlayListRouter = (app: Router): Router => {
  app.use('/playlist', route);

  route.post('/create', auth, playListController.create);

  route.post('/update', auth, playListController.update);

  route.delete('/delete', auth, playListController.delete);

  route.get('/get-all', auth, playListController.getAllPlayLists);

  route.get('/get-my-playlists', auth, playListController.getMyPlayLists);

  route.get('/get-one', auth, playListController.getPlayList);

  route.post('/add', auth, playListController.addMusic);

  route.post('/remove', auth, playListController.removeMusic);

  return route;
};
