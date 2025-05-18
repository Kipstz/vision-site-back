import { Request, Response, NextFunction } from 'express';
import { ILocals } from '../../core';
import { Music } from '../../database/models/music.model';

export default async (
  req: Request,
  res: Response<any, ILocals>,
  next: NextFunction,
): Promise<void> => {
  if (req.url.slice(-4) === '.wav') {
    const _url = req.url.replace('.wav', '');
    const musicianId = _url.split('/')[1];
    const musicId = _url.split('/')[2];

    const music = await Music.findOne({
      where: {
        id: musicId,
        musicianId: musicianId,
      },
    });

    if (music) {
      music.listenAmount = music.listenAmount + 1;
      await music.save();
    }
  }
  next();
};
