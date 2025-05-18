import { EventTypeEnum } from '../../../enums';
import { ICharacter } from './character.model';

export type INews = {
  id: string;
  date: Date;
  media: string;
  title: string;
  content: string;
  characterId: string;
  character: ICharacter;
  type: string;
  serverType: EventTypeEnum;
};
