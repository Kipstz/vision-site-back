import { HttpResponseError } from '../../modules/http-response-error';
import Joi from 'joi';
import {
  IAddOrRemoveMusicBody,
  IDeleteOrGetPlayListBody,
  IGetSinglePlayListQuery,
  IPlayListCreateBody,
  IPlayListUpdateBody,
} from '../controllers/playlist.controller';

export default class PlayListValidation {
  static playListCreateBody(data: IPlayListCreateBody): IPlayListCreateBody {
    const querySchema = Joi.object<IPlayListCreateBody>({
      name: Joi.string(),
      description: Joi.string(),
      image: Joi.string().optional(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) {
      console.log(result.error);
      throw HttpResponseError.createWrongValuesError();
    }

    return { ...result.value };
  }

  static playListUpdateBody(data: IPlayListUpdateBody): IPlayListUpdateBody {
    const querySchema = Joi.object<IPlayListUpdateBody>({
      id: Joi.string(),
      name: Joi.string(),
      description: Joi.string().optional(),
      image: Joi.string().optional(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();

    return { ...result.value };
  }

  static deleteOrGetPlayListBody(data: IDeleteOrGetPlayListBody): IDeleteOrGetPlayListBody {
    const querySchema = Joi.object<IDeleteOrGetPlayListBody>({
      id: Joi.string(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();

    return { ...result.value };
  }

  static getSinglePlayList(data: IGetSinglePlayListQuery): IGetSinglePlayListQuery {
    const querySchema = Joi.object<IGetSinglePlayListQuery>({
      playListId: Joi.string(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();

    return { ...result.value };
  }

  static addOrRemoveMusic(data: IAddOrRemoveMusicBody): IAddOrRemoveMusicBody {
    const querySchema = Joi.object<IAddOrRemoveMusicBody>({
      musicId: Joi.string(),
      playlistId: Joi.string(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();

    return { ...result.value };
  }
}
