import { SessionToken } from '../../../session';
import { IUser } from '../../models';
import { IApiError } from './api-error';

export interface IResponse<T> {
  data: T;
  error?: IApiError | Error;
}

export interface IResponseLocals {
  currentUser: IUser;
  decodedToken: SessionToken;
  targetUser: IUser;
  responseBody?: IResponse<any>;
  controller: string;
  timer: {
    start: Date;
    startTime: [number, number];
    durationToFinish?: number;
    durationToClose?: number;
  };
}
