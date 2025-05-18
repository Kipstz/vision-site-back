export * from './auth.validation';
export * from './event.validation';
export * from './news.validation';
export * from './patch-note.validation';

import Joi from 'joi';

export function UIDQuery(): Joi.StringSchema {
  return Joi.string().min(36).max(36).required();
}
