import { HttpResponseError } from '../../modules/http-response-error';
import Joi from 'joi';
import {
  IDeleteOrGetMusicianBody,
  IMusicianCreateBody,
  IMusicianUpdateBody,
} from '../controllers/musician.controller';

export default class MusicianValidation {
  static musicianCreateBody(data: IMusicianCreateBody): IMusicianCreateBody {
    const querySchema = Joi.object<IMusicianCreateBody>({
      characterId: Joi.string(),
      stageName: Joi.string(),
      banner: Joi.string(),
      profilePicture: Joi.string(),
      isCertified: Joi.boolean(),
      youtubeLink: Joi.string(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) {
      console.log(result.error);
      throw HttpResponseError.createWrongValuesError();
    }

    return { ...result.value };
  }

  static musicianUpdateBody(data: IMusicianUpdateBody): IMusicianUpdateBody {
    const querySchema = Joi.object<IMusicianUpdateBody>({
      id: Joi.string(),
      characterId: Joi.string(),
      stageName: Joi.string(),
      banner: Joi.string(),
      profilePicture: Joi.string(),
      isCertified: Joi.boolean(),
      youtubeLink: Joi.string(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();

    return { ...result.value };
  }

  static deleteOrGetMusicianBody(data: IDeleteOrGetMusicianBody): IDeleteOrGetMusicianBody {
    const querySchema = Joi.object<IDeleteOrGetMusicianBody>({
      id: Joi.string(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();

    return { ...result.value };
  }
}
