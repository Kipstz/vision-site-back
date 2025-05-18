import { HttpResponseError } from '../../modules/http-response-error';
import Joi from 'joi';
import {
  IDeleteOrGetPatchNoteBody,
  ILastPatchNotesQuery,
  IPatchNoteCreateBody,
  IPatchNoteUpdateBody,
} from '../controllers/patch-note.controller';

export default class PatchNoteValidation {
  static patchNoteCreateBody(data: IPatchNoteCreateBody): IPatchNoteCreateBody {
    const querySchema = Joi.object<IPatchNoteCreateBody>({
      date: Joi.date(),
      image: Joi.string(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) {
      console.log(result.error);
      throw HttpResponseError.createWrongValuesError();
    }

    return { ...result.value };
  }

  static patchNoteUpdateBody(data: IPatchNoteUpdateBody): IPatchNoteUpdateBody {
    const querySchema = Joi.object<IPatchNoteUpdateBody>({
      id: Joi.string(),
      date: Joi.date(),
      image: Joi.string(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();

    return { ...result.value };
  }

  static deleteOrGetPatchNoteBody(data: IDeleteOrGetPatchNoteBody): IDeleteOrGetPatchNoteBody {
    const querySchema = Joi.object<IDeleteOrGetPatchNoteBody>({
      id: Joi.string(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();

    return { ...result.value };
  }

  static lastPatchNotesQuery(data: ILastPatchNotesQuery): ILastPatchNotesQuery {
    const querySchema = Joi.object<ILastPatchNotesQuery>({
      limit: Joi.number(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();

    return { ...result.value };
  }
}
