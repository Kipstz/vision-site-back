import { IMusic } from '../../local_core/types/interface/models/music.model';
import { HttpResponseError } from '../../modules/http-response-error';
import { Controller, ILocals } from '../../core';
import { Request, Response } from 'express';
import MusicValidation from '../validations/music.validation';
import { IResponse } from '../../local_core';
import { Music } from '../../database/models/music.model';
import { Favorite } from '../../database/models/favorite.model';
import fs from 'fs-extra';
import { Musician } from '../../database/models/musician.model';
import { checkRoleRights } from '../../utils/auth.utils';

export interface IMusicCreateBody {
  musicianId: string;
  name: string;
  image: string;
}

export interface IMusicUpdateBody {
  id: string;
  musicianId: string;
  name: string;
  image: string;
}

export interface IUpdateFavoriteBody {
  musicId: string;
}

export interface IUpdateFavoriteResponse {
  musicId: string;
  isFavorite: boolean;
}

export interface ICompleteMusicData extends IMusic {
  isFav: boolean;
}

export interface IMusicListResponse {
  musics: ICompleteMusicData[];
}

export interface IMusicsByJobQuery {
  musicianId?: string;
}

export interface IMusicResponse {
  music: IMusic;
}

export interface IMusicCreateResponse extends IMusicResponse {
  uploadPath: string;
}

export interface IDeleteOrGetMusicBody {
  id?: string;
}

class MusicController implements Controller {
  async create(
    req: Request<Record<string, never>, IMusicCreateResponse, IMusicCreateBody>,
    res: Response<IResponse<IMusicCreateResponse>, ILocals>,
  ): Promise<void> {
    checkRoleRights(1, res.locals.currentUser);
    req.body = MusicValidation.musicCreateBody(req.body);

    const musician = await Musician.findOne({
      where: {
        id: req.body.musicianId,
      },
    });

    if (!musician) {
      throw HttpResponseError.createNotFoundError();
    }

    const music = await Music.create({
      name: req.body.name,
      image: req.body.image,
      musicianId: musician.id,
      listenAmount: 0,
    });

    res.json({
      data: {
        music,
        uploadPath: `/music/upload/${music.musicianId}/${music.id}`,
      },
    });
  }

  async upload(
    req: Request<Record<string, never>, IMusicResponse, IMusicCreateBody>,
    res: Response<IResponse<IMusicResponse>, ILocals>,
  ): Promise<void> {
    checkRoleRights(1, res.locals.currentUser);
    if (!req.file) throw HttpResponseError.createWrongValuesError();

    const music = await Music.findOne({
      where: {
        id: req.params.musicId,
        musicianId: req.params.musicianId,
      },
    });

    if (!music) throw HttpResponseError.createNotFoundError();

    if (!fs.existsSync('./musiques')) {
      fs.mkdirSync('./musiques');
    }
    if (!fs.existsSync(`./musiques/${req.params.musicianId}`)) {
      fs.mkdirSync(`./musiques/${req.params.musicianId}`);
    }

    if (fs.existsSync(`./musiques/${req.params.musicianId}/${req.params.musicId}.wav`)) {
      throw HttpResponseError.existingMusic();
    }
    fs.writeFileSync(
      `./musiques/${req.params.musicianId}/${req.params.musicId}.wav`,
      req.file.buffer,
    );

    res.json({ data: { music } });
  }

  async update(
    req: Request<Record<string, never>, IMusicResponse, IMusicUpdateBody>,
    res: Response<IResponse<IMusicResponse>, ILocals>,
  ): Promise<void> {
    checkRoleRights(1, res.locals.currentUser);
    req.body = MusicValidation.musicUpdateBody(req.body);
    const music = await Music.findOne({
      where: {
        id: req.body.id,
      },
    });

    if (!music) {
      throw HttpResponseError.createNotFoundError();
    }

    await music.update({
      musicianId: req.body.musicianId,
      name: req.body.name,
      image: req.body.image,
    });

    await music.save();
    await music.reload();

    res.json({ data: { music } });
  }

  async delete(
    req: Request<Record<string, never>, IMusicResponse, void, IDeleteOrGetMusicBody>,
    res: Response<IResponse<IMusicResponse>, ILocals>,
  ): Promise<void> {
    checkRoleRights(1, res.locals.currentUser);
    req.query = MusicValidation.deleteOrGetMusicBody(req.query);
    const music = await Music.findOne({
      where: {
        id: req.query.id,
      },
    });

    if (!music) {
      throw HttpResponseError.createNotFoundError();
    }

    await music.destroy();

    res.json({ data: { music } });
  }

  async getAll(
    req: Request<Record<string, never>, IMusicListResponse, void>,
    res: Response,
  ): Promise<void> {
    const musics = await Music.findAll({
      include: [
        {
          model: Musician,
          as: 'musician',
        },
      ],
    });
    let favorites: any[] = [];
    if (res?.locals?.currentUser) {
      favorites = await Favorite.findAll({
        where: {
          userId: res.locals.currentUser.id,
        },
      });
    }

    res.json({
      data: {
        musics: musics.map((f: any) => {
          const e = { ...f.dataValues };
          e.isFavorite = favorites.filter((_e) => _e.musicId === e.id).length > 0;
          return e;
        }),
      },
    });
  }

  async getByMusicianId(
    req: Request<Record<string, never>, IMusicListResponse, void, IMusicsByJobQuery>,
    res: Response,
  ): Promise<void> {
    req.query = MusicValidation.getMusicsByMusicianId(req.query);
    const musics = await Music.findAll({
      where: {
        musicianId: req.query.musicianId,
      },
    });

    const favorites = await Favorite.findAll({
      where: {
        userId: res.locals.currentUser.id,
      },
    });

    res.json({
      data: {
        musics: musics.map((e: any) => {
          e.isFav = favorites.find((_e) => _e.musicId === e.id) ? true : false;
          return e;
        }),
      },
    });
  }

  async updateFavorite(
    req: Request<Record<string, never>, IUpdateFavoriteResponse, IUpdateFavoriteBody>,
    res: Response<IResponse<IUpdateFavoriteResponse>, ILocals>,
  ): Promise<void> {
    req.body = MusicValidation.updateFavorite(req.body);
    const favorite = await Favorite.findOne({
      where: {
        userId: res.locals.currentUser.id,
        musicId: req.body.musicId,
      },
    });

    if (!favorite) {
      await Favorite.create({
        userId: res.locals.currentUser.id,
        musicId: req.body.musicId,
      });
      res.json({
        data: {
          musicId: req.body.musicId,
          isFavorite: true,
        },
      });
      return;
    }
    await favorite.destroy();
    res.json({
      data: {
        musicId: req.body.musicId,
        isFavorite: false,
      },
    });
  }
}

export default new MusicController();
