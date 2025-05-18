import { HttpResponseError } from '../../modules/http-response-error';
import Joi from 'joi';
import {
  IDeleteOrGetNewsBody,
  ILastNewsQuery,
  INewsCreateBody,
  INewsUpdateBody,
} from '../controllers/news.controller';

export default class NewsValidation {
  static newsCreateBody(data: INewsCreateBody): INewsCreateBody {
    const querySchema = Joi.object<INewsCreateBody>({
      date: Joi.date(),
      media: Joi.string(),
      title: Joi.string(),
      type: Joi.string().valid('video', 'text', 'image'),
      characterId: Joi.string(),
      content: Joi.string().when('type', {
        is: Joi.string().valid('text'),
        then: Joi.required(),
        otherwise: Joi.optional(),
      }),
      serverType: Joi.number(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) {
      console.log(result.error);
      throw HttpResponseError.createWrongValuesError();
    }

    return { ...result.value };
  }

  static newsUpdateBody(data: INewsUpdateBody): INewsUpdateBody {
    const querySchema = Joi.object<INewsUpdateBody>({
      id: Joi.string(),
      date: Joi.date(),
      media: Joi.string(),
      title: Joi.string(),
      type: Joi.string().valid('video', 'text', 'image'),
      characterId: Joi.string(),
      content: Joi.string().optional(),
      serverType: Joi.number(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();

    return { ...result.value };
  }

  static deleteOrGetNewsBody(data: IDeleteOrGetNewsBody): IDeleteOrGetNewsBody {
    const querySchema = Joi.object<IDeleteOrGetNewsBody>({
      id: Joi.string(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();

    return { ...result.value };
  }

  static lastNewsQuery(data: ILastNewsQuery): ILastNewsQuery {
    const querySchema = Joi.object<ILastNewsQuery>({
      limit: Joi.number(),
      serverType: Joi.number(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();

    return { ...result.value };
  }
}
