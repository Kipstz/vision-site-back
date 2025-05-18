import { ICharacter } from './character.model';
import { IMusic } from './music.model';

export type IMusician = {
  id: string;
  characterId: string;
  character?: ICharacter;
  stageName: string;
  banner: string;
  profilePicture: string;
  isCertified: boolean;
  youtubeLink: string;
  musics?: IMusic[];
};
