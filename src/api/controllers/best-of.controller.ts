import { IBestOf } from '../../local_core/types/interface/models/best-of.model';
import { HttpResponseError } from '../../modules/http-response-error';
import { Controller, ILocals } from '../../core';
import { Request, Response } from 'express';
import BestOfValidation from '../validations/best-of.validation';
import { BestOf } from '../../database';
import { IResponse } from '../../local_core';
import { checkRoleRights } from '../../utils/auth.utils';

export interface IBestOfCreateBody {
  index: number;
  url: string;
}

export interface IBestOfUpdateBody {
  id: string;
  index: number;
  url: string;
}

export interface IBestOfResponse {
  bestOf: IBestOf;
}

export interface ILastBestOfsQuery {
  limit?: number;
}

export interface IBestOfListResponse {
  bestOfs: IBestOf[];
}

export interface IDeleteOrGetBestOfBody {
  id?: string;
}

class BestOfController implements Controller {
  async create(
    req: Request<Record<string, never>, IBestOfResponse, IBestOfCreateBody>,
    res: Response<IResponse<IBestOfResponse>, ILocals>,
  ): Promise<void> {
    checkRoleRights(1, res.locals.currentUser);
    req.body = BestOfValidation.bestOfCreateBody(req.body);
    const bestOf = await BestOf.create({
      index: req.body.index,
      url: req.body.url,
    });

    res.json({ data: { bestOf } });
  }

  async update(
    req: Request<Record<string, never>, IBestOfResponse, IBestOfUpdateBody>,
    res: Response<IResponse<IBestOfResponse>, ILocals>,
  ): Promise<void> {
    checkRoleRights(1, res.locals.currentUser);
    req.body = BestOfValidation.bestOfUpdateBody(req.body);
    const bestOf = await BestOf.findOne({
      where: {
        id: req.body.id,
      },
    });

    if (!bestOf) {
      throw HttpResponseError.createNotFoundError();
    }

    bestOf.update({
      index: req.body.index,
      url: req.body.url,
    });

    bestOf.save();
    bestOf.reload();

    res.json({ data: { bestOf } });
  }

  async get(
    req: Request<Record<string, never>, IBestOfResponse, IDeleteOrGetBestOfBody>,
    res: Response<IResponse<IBestOfResponse>, ILocals>,
  ): Promise<void> {
    req.body = BestOfValidation.deleteOrGetBestOfBody(req.body);
    const bestOf = await BestOf.findOne({
      where: {
        id: req.body.id,
      },
    });

    if (!bestOf) {
      throw HttpResponseError.createNotFoundError();
    }

    res.json({ data: { bestOf } });
  }

  async getLasts(
    req: Request<Record<string, never>, IBestOfListResponse, void, ILastBestOfsQuery>,
    res: any,
  ): Promise<void> {
    req.query = BestOfValidation.lastBestOfsQuery(req.query);
    const bestOfs = await BestOf.findAll({
      order: [['index', 'ASC']],
      limit: req.query.limit,
    });

    res.json({ data: { bestOfs } });
  }

  async getAll(req: Request<Record<string, never>, any>, res: any): Promise<void> {
    checkRoleRights(1, res.locals.currentUser);
    const bestOfs = await BestOf.findAll();

    if (!bestOfs) {
      throw HttpResponseError.createNotFoundError();
    }

    res.json({ data: { bestOfs } });
  }

  async delete(
    req: Request<Record<string, never>, IBestOfResponse, void, IDeleteOrGetBestOfBody>,
    res: Response<IResponse<IBestOfResponse>, ILocals>,
  ): Promise<void> {
    checkRoleRights(1, res.locals.currentUser);
    req.query = BestOfValidation.deleteOrGetBestOfBody(req.query);
    const bestOf = await BestOf.findOne({
      where: {
        id: req.query.id,
      },
    });

    if (!bestOf) {
      throw HttpResponseError.createNotFoundError();
    }

    bestOf.destroy();

    res.json({ data: { bestOf } });
  }
}

export default new BestOfController();
