import { INews } from '../../local_core/types/interface/models/news.model';
import { HttpResponseError } from '../../modules/http-response-error';
import { Controller, ILocals } from '../../core';
import { Request, Response } from 'express';
import NewsValidation from '../validations/news.validation';
import { News } from '../../database';
import { IResponse } from '../../local_core';
import { Character } from '../../database/models/character.model';
import { checkRoleRights } from '../../utils/auth.utils';
import { EventTypeEnum } from '../../local_core';

export interface INewsCreateBody {
  date: Date;
  media: string;
  title: string;
  type: 'video' | 'text';
  characterId: string;
  content?: string;
  serverType: EventTypeEnum;
}

export interface INewsUpdateBody {
  id: string;
  date: Date;
  media: string;
  title: string;
  type: 'video' | 'text';
  characterId: string;
  content?: string;
  serverType: EventTypeEnum;
}

export interface ILastNewsQuery {
  limit?: number;
  serverType: EventTypeEnum;
}

export interface INewsListResponse {
  news: INews[];
}

export interface INewsResponse {
  news: INews;
}

export interface IDeleteOrGetNewsBody {
  id?: string;
}

class NewsController implements Controller {
  async create(
    req: Request<Record<string, never>, INewsResponse, INewsCreateBody>,
    res: Response<IResponse<INewsResponse>, ILocals>,
  ): Promise<void> {
    checkRoleRights(1, res.locals.currentUser);
    req.body = NewsValidation.newsCreateBody(req.body);
    const news = await News.create({
      date: req.body.date,
      media: req.body.media,
      title: req.body.title,
      type: req.body.type,
      characterId: req.body.characterId,
      content: req.body?.content ?? null,
      serverType: req.body.serverType,
    });

    res.json({ data: { news } });
  }

  async update(
    req: Request<Record<string, never>, INewsResponse, INewsUpdateBody>,
    res: Response<IResponse<INewsResponse>, ILocals>,
  ): Promise<void> {
    checkRoleRights(1, res.locals.currentUser);
    req.body = NewsValidation.newsUpdateBody(req.body);
    const news = await News.findOne({
      where: {
        id: req.body.id,
      },
    });

    if (!news) {
      throw HttpResponseError.createNotFoundError();
    }

    await news.update({
      date: req.body.date,
      media: req.body.media,
      title: req.body.title,
      type: req.body.type,
      characterId: req.body.characterId,
      content: req.body?.content ?? null,
      serverType: req.body.serverType,
    });

    await news.save();
    await news.reload();

    res.json({ data: { news } });
  }

  async get(
    req: Request<Record<string, never>, INewsResponse, void, IDeleteOrGetNewsBody>,
    res: any,
  ): Promise<void> {
    req.query = NewsValidation.deleteOrGetNewsBody(req.query);
    const news = await News.findOne({
      where: {
        id: req.query.id,
      },
      include: [
        {
          model: Character,
          as: 'character',
          attributes: {
            exclude: ['id'],
          },
        },
      ],
    });

    if (!news) {
      throw HttpResponseError.createNotFoundError();
    }

    res.json({ data: { news } });
  }

  async delete(
    req: Request<Record<string, never>, INewsResponse, void, IDeleteOrGetNewsBody>,
    res: Response<IResponse<INewsResponse>, ILocals>,
  ): Promise<void> {
    checkRoleRights(1, res.locals.currentUser);
    req.query = NewsValidation.deleteOrGetNewsBody(req.query);
    const news = await News.findOne({
      where: {
        id: req.query.id,
      },
    });

    if (!news) {
      throw HttpResponseError.createNotFoundError();
    }

    await news.destroy();

    res.json({ data: { news } });
  }

  async getAll(req: Request<Record<string, never>, any>, res: any): Promise<void> {
    checkRoleRights(1, res.locals.currentUser);
    const news = await News.findAll();

    if (!news) {
      throw HttpResponseError.createNotFoundError();
    }

    res.json({ data: { news } });
  }

  async getLasts(
    req: Request<Record<string, never>, INewsListResponse, void, ILastNewsQuery>,
    res: any,
  ): Promise<void> {
    req.query = NewsValidation.lastNewsQuery(req.query);
    const news = await News.findAll({
      order: [['date', 'DESC']],
      limit: req.query.limit,
      where: {
        serverType: req.query.serverType,
      },
      include: [
        {
          model: Character,
          as: 'character',
          attributes: {
            exclude: ['id'],
          },
        },
      ],
    });

    res.json({ data: { news } });
  }
}

export default new NewsController();
