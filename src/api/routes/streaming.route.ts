import { Router } from 'express';
import streamingController from '../controllers/streaming.controller';

const route = Router();

export const StreamingRoute = (app: Router): Router => {
  app.use('/streaming', route);

  route.get('/all', streamingController.getAll);

  route.get('/streaming-vision', streamingController.getStreamingVision);

  return route;
};
