import { EventTypeEnum } from '../../../enums';

export type IEvent = {
  id: string;
  date: Date;
  image: string;
  title: string;
  place: string;
  type: EventTypeEnum;
};
