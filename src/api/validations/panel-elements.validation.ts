import { HttpResponseError } from '../../modules/http-response-error';
import Joi from 'joi';
import {
  IPanelElementCreateBody,
  IPanelElementUpdateBody,
  IDeleteOrGetPanelElementBody,
} from '../controllers/panel-elements.controller';

export default class PanelElementsValidation {
  static panelElementCreateBody(data: IPanelElementCreateBody): IPanelElementCreateBody {
    const querySchema = Joi.object<IPanelElementCreateBody>({
      link: Joi.string(),
      image: Joi.string(),
      label: Joi.string(),
      color: Joi.string(),
      category: Joi.string().valid('public', 'lifeinvader', 'company'),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) {
      console.log(result.error);
      throw HttpResponseError.createWrongValuesError();
    }

    return { ...result.value };
  }

  static panelElementUpdateBody(data: IPanelElementUpdateBody): IPanelElementUpdateBody {
    const querySchema = Joi.object<IPanelElementUpdateBody>({
      id: Joi.string(),
      link: Joi.string(),
      image: Joi.string(),
      label: Joi.string(),
      color: Joi.string(),
      category: Joi.string().valid('public', 'lifeinvader', 'company'),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();

    return { ...result.value };
  }

  static deleteOrGetPanelElementBody(
    data: IDeleteOrGetPanelElementBody,
  ): IDeleteOrGetPanelElementBody {
    const querySchema = Joi.object<IDeleteOrGetPanelElementBody>({
      id: Joi.string(),
    }).options({ presence: 'required' });

    const result = querySchema.validate(data);
    if (result.error) throw HttpResponseError.createWrongValuesError();

    return { ...result.value };
  }
}
