import { IMusic } from './music.model';

export type IPlayList = {
  id: string;
  musics: IMusic[];
  name: string;
  description: string | null;
  userId: string;
  image: string | null;
};
