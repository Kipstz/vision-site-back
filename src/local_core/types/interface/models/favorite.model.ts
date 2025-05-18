import { IMusic } from './music.model';

export type IFavorite = {
  id: string;
  userId: string;
  musicId: string;
  music: IMusic;
};
