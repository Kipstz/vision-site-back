import { IPatchNote } from '../../local_core/types/interface/models/patch-note.model';
import { HttpResponseError } from '../../modules/http-response-error';
import { Controller, ILocals } from '../../core';
import { Request, Response } from 'express';
import PatchNoteValidation from '../validations/patch-note.validation';
import { PatchNote } from '../../database';
import { IResponse } from '../../local_core';
import { checkRoleRights } from '../../utils/auth.utils';

export interface IPatchNoteCreateBody {
  date: Date;
  image: string;
}

export interface IPatchNoteUpdateBody {
  id: string;
  date: Date;
  image: string;
}

export interface IPatchNoteResponse {
  patchNote: IPatchNote;
}

export interface ILastPatchNotesQuery {
  limit?: number;
}

export interface IPatchNoteListResponse {
  patchNotes: IPatchNote[];
}

export interface IDeleteOrGetPatchNoteBody {
  id?: string;
}

class PatchNoteController implements Controller {
  async create(
    req: Request<Record<string, never>, IPatchNoteResponse, IPatchNoteCreateBody>,
    res: Response<IResponse<IPatchNoteResponse>, ILocals>,
  ): Promise<void> {
    checkRoleRights(1, res.locals.currentUser);
    req.body = PatchNoteValidation.patchNoteCreateBody(req.body);
    const patchNote = await PatchNote.create({
      date: req.body.date,
      image: req.body.image,
    });

    res.json({ data: { patchNote } });
  }

  async update(
    req: Request<Record<string, never>, IPatchNoteResponse, IPatchNoteUpdateBody>,
    res: Response<IResponse<IPatchNoteResponse>, ILocals>,
  ): Promise<void> {
    checkRoleRights(1, res.locals.currentUser);
    req.body = PatchNoteValidation.patchNoteUpdateBody(req.body);
    const patchNote = await PatchNote.findOne({
      where: {
        id: req.body.id,
      },
    });

    if (!patchNote) {
      throw HttpResponseError.createNotFoundError();
    }

    patchNote.update({
      date: req.body.date,
      image: req.body.image,
    });

    patchNote.save();
    patchNote.reload();

    res.json({ data: { patchNote } });
  }

  async get(
    req: Request<Record<string, never>, IPatchNoteResponse, IDeleteOrGetPatchNoteBody>,
    res: Response<IResponse<IPatchNoteResponse>, ILocals>,
  ): Promise<void> {
    req.body = PatchNoteValidation.deleteOrGetPatchNoteBody(req.body);
    const patchNote = await PatchNote.findOne({
      where: {
        id: req.body.id,
      },
    });

    if (!patchNote) {
      throw HttpResponseError.createNotFoundError();
    }

    res.json({ data: { patchNote } });
  }

  async getLasts(
    req: Request<Record<string, never>, IPatchNoteListResponse, void, ILastPatchNotesQuery>,
    res: any,
  ): Promise<void> {
    req.query = PatchNoteValidation.lastPatchNotesQuery(req.query);
    const patchNotes = await PatchNote.findAll({
      order: [['date', 'DESC']],
      limit: req.query.limit,
    });

    res.json({ data: { patchNotes } });
  }

  async getAll(req: Request<Record<string, never>, any>, res: any): Promise<void> {
    checkRoleRights(1, res.locals.currentUser);
    const patchNotes = await PatchNote.findAll();

    if (!patchNotes) {
      throw HttpResponseError.createNotFoundError();
    }

    res.json({ data: { patchNotes } });
  }

  async delete(
    req: Request<Record<string, never>, IPatchNoteResponse, void, IDeleteOrGetPatchNoteBody>,
    res: Response<IResponse<IPatchNoteResponse>, ILocals>,
  ): Promise<void> {
    checkRoleRights(1, res.locals.currentUser);
    req.query = PatchNoteValidation.deleteOrGetPatchNoteBody(req.query);
    const patchNote = await PatchNote.findOne({
      where: {
        id: req.query.id,
      },
    });

    if (!patchNote) {
      throw HttpResponseError.createNotFoundError();
    }

    patchNote.destroy();

    res.json({ data: { patchNote } });
  }
}

export default new PatchNoteController();
