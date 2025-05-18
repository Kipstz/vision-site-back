import { HttpResponseError } from '../../modules/http-response-error';
import Joi from 'joi';
import {
  IDeleteOrGetBestOfBody,
  ILastBestOfsQuery,
  IBestOfCreateBody,
  IBestOfUpdateBody,
} from '../controllers/best-of.controller';

export default class BestOfValidation {
  static bestOfCreateBody(data: IBestOfCreateBody): IBestOfCreateBody {
    const querySchema = Joi.object<IBestOfCreateBody>({
      index: Joi.number(),
      url: Joi.string(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) {
      console.log(result.error);
      throw HttpResponseError.createWrongValuesError();
    }

    return { ...result.value };
  }

  static bestOfUpdateBody(data: IBestOfUpdateBody): IBestOfUpdateBody {
    const querySchema = Joi.object<IBestOfUpdateBody>({
      id: Joi.string(),
      index: Joi.number(),
      url: Joi.string(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();

    return { ...result.value };
  }

  static deleteOrGetBestOfBody(data: IDeleteOrGetBestOfBody): IDeleteOrGetBestOfBody {
    const querySchema = Joi.object<IDeleteOrGetBestOfBody>({
      id: Joi.string(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();

    return { ...result.value };
  }

  static lastBestOfsQuery(data: ILastBestOfsQuery): ILastBestOfsQuery {
    const querySchema = Joi.object<ILastBestOfsQuery>({
      limit: Joi.number(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();

    return { ...result.value };
  }
}
