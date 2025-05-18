import { HttpResponseError } from '../../modules/http-response-error';
import { Controller, ILocals } from '../../core';
import { Request, Response } from 'express';
import { IResponse } from '../../local_core';
import { PlayListMusic } from '../../database/models/playlist-music';
import { IPlayList } from '../../local_core/types/interface/models/playlist.model';
import PlayListValidation from '../validations/playlist.validation';
import { PlayList } from '../../database/models/playlist.model';
import { Music } from '../../database/models/music.model';
import { Musician } from '../../database/models/musician.model';

export interface IPlayListCreateBody {
  name: string;
  description?: string;
  image?: string;
}

export interface IPlayListUpdateBody {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

export interface IPlayListListResponse {
  playLists: IPlayList[];
}

export interface IPlayListResponse {
  playList: IPlayList;
}

export interface IDeleteOrGetPlayListBody {
  id: string;
}

export interface IGetSinglePlayListQuery {
  playListId?: string;
}

export interface IAddOrRemoveMusicBody {
  musicId: string;
  playlistId: string;
}

export interface IAddOrRemoveMusicResponse {
  musicId: string;
  playlistId: string;
}

class PlayListController implements Controller {
  async create(
    req: Request<Record<string, never>, IPlayListResponse, IPlayListCreateBody>,
    res: Response<IResponse<IPlayListResponse>, ILocals>,
  ): Promise<void> {
    req.body = PlayListValidation.playListCreateBody(req.body);

    const playList = await PlayList.create({
      userId: res.locals.currentUser.id,
      name: req.body.name,
      description: req.body?.description ?? null,
      image: req.body?.image ?? null,
    });

    res.json({ data: { playList } });
  }

  async update(
    req: Request<Record<string, never>, IPlayListResponse, IPlayListUpdateBody>,
    res: Response<IResponse<IPlayListResponse>, ILocals>,
  ): Promise<void> {
    req.body = PlayListValidation.playListUpdateBody(req.body);
    const playList = await PlayList.findOne({
      where: {
        id: req.body.id,
        userId: res.locals.currentUser.id,
        description: req.body?.description ?? null,
        image: req.body?.image ?? null,
      },
    });

    if (!playList) {
      throw HttpResponseError.createNotFoundError();
    }

    await playList.update({
      name: req.body.name,
      description: req.body.description,
    });

    await playList.save();
    await playList.reload();

    res.json({ data: { playList } });
  }

  async delete(
    req: Request<Record<string, never>, IPlayListResponse, IDeleteOrGetPlayListBody>,
    res: Response<IResponse<IPlayListResponse>, ILocals>,
  ): Promise<void> {
    req.body = PlayListValidation.deleteOrGetPlayListBody(req.body);
    const playList = await PlayList.findOne({
      where: {
        id: req.body.id,
      },
    });

    if (!playList) {
      throw HttpResponseError.createNotFoundError();
    }

    await PlayListMusic.destroy({
      where: {
        playListId: playList.id,
      },
    });

    await playList.destroy();

    res.json({ data: { playList } });
  }

  async getMyPlayLists(
    req: Request<Record<string, never>, IPlayListListResponse, void>,
    res: Response<IResponse<IPlayListListResponse>, ILocals>,
  ): Promise<void> {
    const playLists = await PlayList.findAll({
      where: {
        userId: res.locals.currentUser.id,
      },
      include: [
        {
          model: Music,
          as: 'musics',
          through: {
            attributes: [],
          },
          required: false,
          duplicating: false,
          include: [
            {
              model: Musician,
              as: 'musician',
            },
          ],
        },
      ],
    });

    res.json({ data: { playLists } });
  }

  async getPlayList(
    req: Request<Record<string, never>, IPlayListResponse, void, IGetSinglePlayListQuery>,
    res: Response<IResponse<IPlayListResponse>, ILocals>,
  ): Promise<void> {
    req.query = PlayListValidation.getSinglePlayList(req.query);
    const playList = await PlayList.findOne({
      where: {
        userId: res.locals.currentUser.id,
      },
      include: [
        {
          model: Music,
          as: 'music',
          required: false,
          duplicating: false,
        },
      ],
    });

    if (!playList) {
      throw HttpResponseError.createNotFoundError();
    }

    res.json({ data: { playList } });
  }

  async addMusic(
    req: Request<Record<string, never>, IAddOrRemoveMusicResponse, IAddOrRemoveMusicBody>,
    res: Response<IResponse<IAddOrRemoveMusicResponse>, ILocals>,
  ): Promise<void> {
    req.body = PlayListValidation.addOrRemoveMusic(req.body);
    const playlist = await PlayList.findOne({
      where: {
        userId: res.locals.currentUser.id,
        id: req.body.playlistId,
      },
    });

    if (!playlist) {
      throw HttpResponseError.createNotFoundError();
    }

    await PlayListMusic.findOrCreate({
      where: {
        musicId: req.body.musicId,
        playListId: playlist.id,
      },
    });

    res.json({ data: { musicId: req.body.musicId, playlistId: req.body.playlistId } });
  }

  async removeMusic(
    req: Request<Record<string, never>, IAddOrRemoveMusicResponse, IAddOrRemoveMusicBody>,
    res: Response<IResponse<IAddOrRemoveMusicResponse>, ILocals>,
  ): Promise<void> {
    req.body = PlayListValidation.addOrRemoveMusic(req.body);
    const playlist = await PlayList.findOne({
      where: {
        userId: res.locals.currentUser.id,
        id: req.body.playlistId,
      },
    });

    if (!playlist) {
      throw HttpResponseError.createNotFoundError();
    }

    await PlayListMusic.destroy({
      where: {
        musicId: req.body.musicId,
        playListId: playlist.id,
      },
    });

    res.json({ data: { musicId: req.body.musicId, playlistId: req.body.playlistId } });
  }

  async getAllPlayLists(
    req: Request<Record<string, never>, IPlayListListResponse, void>,
    res: Response<IResponse<IPlayListListResponse>, ILocals>,
  ): Promise<void> {
    const playLists = await PlayList.findAll();

    res.json({ data: { playLists } });
  }
}

export default new PlayListController();
