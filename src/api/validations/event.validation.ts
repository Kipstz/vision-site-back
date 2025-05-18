import { HttpResponseError } from '../../modules/http-response-error';
import Joi from 'joi';
import {
  IDeleteOrGetEventBody,
  IEventByDateBody,
  IEventCreateBody,
  IEventUpdateBody,
} from '../controllers/event.controller';

export default class EventValidation {
  static eventCreateBody(data: IEventCreateBody): IEventCreateBody {
    const querySchema = Joi.object<IEventCreateBody>({
      date: Joi.date(),
      image: Joi.string(),
      title: Joi.string(),
      place: Joi.string(),
      type: Joi.number(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) {
      console.log(result.error);
      throw HttpResponseError.createWrongValuesError();
    }

    return { ...result.value };
  }

  static eventUpdateBody(data: IEventUpdateBody): IEventUpdateBody {
    const querySchema = Joi.object<IEventUpdateBody>({
      id: Joi.string(),
      date: Joi.date(),
      image: Joi.string(),
      title: Joi.string(),
      place: Joi.string(),
      type: Joi.number(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();

    return { ...result.value };
  }

  static eventByDate(data: IEventByDateBody): IEventByDateBody {
    const querySchema = Joi.object<IEventByDateBody>({
      before: Joi.date(),
      after: Joi.date(),
      type: Joi.number(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();

    return { ...result.value };
  }

  static deleteOrGetEventBody(data: IDeleteOrGetEventBody): IDeleteOrGetEventBody {
    const querySchema = Joi.object<IDeleteOrGetEventBody>({
      id: Joi.string(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();

    return { ...result.value };
  }
}
