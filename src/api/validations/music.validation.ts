import { HttpResponseError } from '../../modules/http-response-error';
import Joi from 'joi';
import {
  IDeleteOrGetMusicBody,
  IMusicCreateBody,
  IMusicUpdateBody,
  IMusicsByJobQuery,
  IUpdateFavoriteBody,
} from '../controllers/music.controller';

export default class MusicValidation {
  static musicCreateBody(data: IMusicCreateBody): IMusicCreateBody {
    const querySchema = Joi.object<IMusicCreateBody>({
      musicianId: Joi.string(),
      name: Joi.string(),
      image: Joi.string(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) {
      console.log(result.error);
      throw HttpResponseError.createWrongValuesError();
    }

    return { ...result.value };
  }

  static musicUpdateBody(data: IMusicUpdateBody): IMusicUpdateBody {
    const querySchema = Joi.object<IMusicUpdateBody>({
      id: Joi.string(),
      musicianId: Joi.string(),
      name: Joi.string(),
      image: Joi.string(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();

    return { ...result.value };
  }

  static deleteOrGetMusicBody(data: IDeleteOrGetMusicBody): IDeleteOrGetMusicBody {
    const querySchema = Joi.object<IDeleteOrGetMusicBody>({
      id: Joi.string(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();

    return { ...result.value };
  }

  static getMusicsByMusicianId(data: IMusicsByJobQuery): IMusicsByJobQuery {
    const querySchema = Joi.object<IMusicsByJobQuery>({
      musicianId: Joi.string(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();

    return { ...result.value };
  }

  static updateFavorite(data: IUpdateFavoriteBody): IUpdateFavoriteBody {
    const querySchema = Joi.object<IUpdateFavoriteBody>({
      musicId: Joi.string(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();

    return { ...result.value };
  }
}
