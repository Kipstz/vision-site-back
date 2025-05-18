import { ICharacter } from '../../local_core/types/interface/models/character.model';
import { HttpResponseError } from '../../modules/http-response-error';
import { Controller, ILocals } from '../../core';
import { Request, Response } from 'express';
import CharacterValidation from '../validations/character.validation';
import { IResponse } from '../../local_core';
import { RPCharacterJobEnum } from '../../local_core/enums/rp-character-job.enum';
import { Character } from '../../database/models/character.model';
import { checkRoleRights } from '../../utils/auth.utils';

export interface ICharacterCreateBody {
  userId: string;
  firstName: string;
  lastName: string;
  job: RPCharacterJobEnum;
}

export interface ICharacterUpdateBody {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  job: RPCharacterJobEnum;
}

export interface ICharacterListResponse {
  characters: ICharacter[];
}

export interface ICharactersByJobQuery {
  job?: RPCharacterJobEnum;
}

export interface ICharacterResponse {
  character: ICharacter;
}

export interface IDeleteOrGetCharacterBody {
  id?: string;
}

class CharacterController implements Controller {
  async create(
    req: Request<Record<string, never>, ICharacterResponse, ICharacterCreateBody>,
    res: Response<IResponse<ICharacterResponse>, ILocals>,
  ): Promise<void> {
    checkRoleRights(1, res.locals.currentUser);
    req.body = CharacterValidation.characterCreateBody(req.body);

    const character = await Character.create({
      userId: req.body.userId,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      job: req.body.job ?? 2,
    });

    res.json({ data: { character } });
  }

  async update(
    req: Request<Record<string, never>, ICharacterResponse, ICharacterUpdateBody>,
    res: Response<IResponse<ICharacterResponse>, ILocals>,
  ): Promise<void> {
    checkRoleRights(1, res.locals.currentUser);
    req.body = CharacterValidation.characterUpdateBody(req.body);
    const character = await Character.findOne({
      where: {
        id: req.body.id,
      },
    });

    if (!character) {
      throw HttpResponseError.createNotFoundError();
    }

    await character.update({
      userId: req.body.userId,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      job: req.body.job ?? 2,
    });

    await character.save();
    await character.reload();

    res.json({ data: { character } });
  }

  async delete(
    req: Request<Record<string, never>, ICharacterResponse, void, IDeleteOrGetCharacterBody>,
    res: Response<IResponse<ICharacterResponse>, ILocals>,
  ): Promise<void> {
    checkRoleRights(1, res.locals.currentUser);
    req.query = CharacterValidation.deleteOrGetCharacterBody(req.query);
    const character = await Character.findOne({
      where: {
        id: req.query.id,
      },
    });

    if (!character) {
      throw HttpResponseError.createNotFoundError();
    }

    await character.destroy();

    res.json({ data: { character } });
  }

  async getAll(
    req: Request<Record<string, never>, ICharacterListResponse, void>,
    res: Response<IResponse<ICharacterListResponse>, ILocals>,
  ): Promise<void> {
    checkRoleRights(1, res.locals.currentUser);
    const characters = await Character.findAll();

    res.json({ data: { characters } });
  }

  async getByJob(
    req: Request<Record<string, never>, ICharacterListResponse, void, ICharactersByJobQuery>,
    res: Response<IResponse<ICharacterListResponse>, ILocals>,
  ): Promise<void> {
    checkRoleRights(1, res.locals.currentUser);
    req.query = CharacterValidation.getCharactersByJobQuery(req.query);
    const characters = await Character.findAll({
      where: {
        job: req.query.job,
      },
    });

    res.json({ data: { characters } });
  }
}

export default new CharacterController();
