import { HttpResponseError } from '../../modules/http-response-error';
import Joi from 'joi';

export default class AuthValidation {
  static signinBody(data: any): any {
    const querySchema = Joi.object<any>({
      username: Joi.string(),
      password: Joi.string(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createInternalServerError();

    return { ...result.value };
  }

  static signupBody(data: any): any {
    const querySchema = Joi.object<any>({
      username: Joi.string().min(3).max(20),
      password: Joi.string().min(5).max(30),
      shownName: Joi.string().min(3).max(20),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createTooManyFilters();

    return { ...result.value };
  }
}
