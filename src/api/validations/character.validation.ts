import { HttpResponseError } from '../../modules/http-response-error';
import Joi from 'joi';
import {
  IDeleteOrGetCharacterBody,
  ICharacterCreateBody,
  ICharacterUpdateBody,
  ICharactersByJobQuery,
} from '../controllers/character.controller';
import { RPCharacterJobEnum } from '../../local_core/enums/rp-character-job.enum';

export default class CharacterValidation {
  static characterCreateBody(data: ICharacterCreateBody): ICharacterCreateBody {
    const querySchema = Joi.object<ICharacterCreateBody>({
      userId: Joi.string(),
      firstName: Joi.string(),
      lastName: Joi.string(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) {
      console.log(result.error);
      throw HttpResponseError.createWrongValuesError();
    }

    return { ...result.value };
  }

  static characterUpdateBody(data: ICharacterUpdateBody): ICharacterUpdateBody {
    const querySchema = Joi.object<ICharacterUpdateBody>({
      id: Joi.string(),
      userId: Joi.string(),
      firstName: Joi.string(),
      lastName: Joi.string(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();

    return { ...result.value };
  }

  static deleteOrGetCharacterBody(data: IDeleteOrGetCharacterBody): IDeleteOrGetCharacterBody {
    const querySchema = Joi.object<IDeleteOrGetCharacterBody>({
      id: Joi.string(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();

    return { ...result.value };
  }

  static getCharactersByJobQuery(data: ICharactersByJobQuery): ICharactersByJobQuery {
    const querySchema = Joi.object<ICharactersByJobQuery>({
      job: Joi.string()
        .valid(...Object.values(RPCharacterJobEnum))
        .required(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();

    return { ...result.value };
  }
}
