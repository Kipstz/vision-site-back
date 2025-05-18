import { RPCharacterJobEnum } from '../../../enums/rp-character-job.enum';
import { IUser } from './user.model';

export type ICharacter = {
  id: string;
  userId: string;
  user?: IUser;
  firstName: string;
  lastName: string;
  job: RPCharacterJobEnum;
};
