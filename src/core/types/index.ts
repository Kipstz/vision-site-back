import { User } from '../../database';
import { IResponse } from '../../local_core';
export * from './database.utils';
export * from './controller.abstract';

export type ILocals = {
  currentUser: User;
} & ILocalLogger;

export type IResponseUnloggedLocals = ILocalLogger;

type ILocalTimer = {
  start: Date;
  startTime: [number, number];
  durationToFinish?: number;
  durationToClose?: number;
};

type ILocalLogger = {
  responseBody?: IResponse<Record<string, unknown>>;
  controller: string;
  timer: ILocalTimer;
  isAdmin: boolean;
};
