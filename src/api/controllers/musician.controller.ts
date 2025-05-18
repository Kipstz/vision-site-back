import { IMusician } from '../../local_core/types/interface/models/musician.model';
import { HttpResponseError } from '../../modules/http-response-error';
import { Controller, ILocals } from '../../core';
import { Request, Response } from 'express';
import MusicianValidation from '../validations/musician.validation';
import { IResponse } from '../../local_core';
import { Musician } from '../../database/models/musician.model';
import { IMusic } from '../../local_core/types/interface/models/music.model';
import { checkRoleRights } from '../../utils/auth.utils';

export interface IMusicianCreateBody {
  characterId: string;
  stageName: string;
  banner: string;
  profilePicture: string;
  isCertified: boolean;
  youtubeLink: string;
  musics?: IMusic[];
}

export interface IMusicianUpdateBody {
  id: string;
  characterId: string;
  stageName: string;
  banner: string;
  profilePicture: string;
  isCertified: boolean;
  youtubeLink: string;
  musics?: IMusic[];
}

export interface IMusicianListResponse {
  musicians: IMusician[];
}

export interface IMusicianResponse {
  musician: IMusician;
}

export interface IDeleteOrGetMusicianBody {
  id?: string;
}

class MusicianController implements Controller {
  async create(
    req: Request<Record<string, never>, IMusicianResponse, IMusicianCreateBody>,
    res: Response<IResponse<IMusicianResponse>, ILocals>,
  ): Promise<void> {
    checkRoleRights(1, res.locals.currentUser);
    req.body = MusicianValidation.musicianCreateBody(req.body);

    const musician = await Musician.create({
      characterId: req.body.characterId,
      stageName: req.body.stageName,
      banner: req.body.banner,
      profilePicture: req.body.profilePicture,
      isCertified: req.body.isCertified,
      youtubeLink: req.body.youtubeLink,
    });

    res.json({ data: { musician } });
  }

  async update(
    req: Request<Record<string, never>, IMusicianResponse, IMusicianUpdateBody>,
    res: Response<IResponse<IMusicianResponse>, ILocals>,
  ): Promise<void> {
    checkRoleRights(1, res.locals.currentUser);
    req.body = MusicianValidation.musicianUpdateBody(req.body);
    const musician = await Musician.findOne({
      where: {
        id: req.body.id,
      },
    });

    if (!musician) {
      throw HttpResponseError.createNotFoundError();
    }

    await musician.update({
      characterId: req.body.characterId,
      stageName: req.body.stageName,
      banner: req.body.banner,
      profilePicture: req.body.profilePicture,
      isCertified: req.body.isCertified,
      youtubeLink: req.body.youtubeLink,
    });

    await musician.save();
    await musician.reload();

    res.json({ data: { musician } });
  }

  async delete(
    req: Request<Record<string, never>, IMusicianResponse, void, IDeleteOrGetMusicianBody>,
    res: Response<IResponse<IMusicianResponse>, ILocals>,
  ): Promise<void> {
    checkRoleRights(1, res.locals.currentUser);
    req.query = MusicianValidation.deleteOrGetMusicianBody(req.query);
    const musician = await Musician.findOne({
      where: {
        id: req.query.id,
      },
    });

    if (!musician) {
      throw HttpResponseError.createNotFoundError();
    }

    await musician.destroy();

    res.json({ data: { musician } });
  }

  async getAll(
    req: Request<Record<string, never>, IMusicianListResponse, void>,
    res: Response<any>,
  ): Promise<void> {
    const musicians = await Musician.findAll();

    res.json({ data: { musicians } });
  }
}

export default new MusicianController();
