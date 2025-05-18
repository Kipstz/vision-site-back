import { IMusician } from './musician.model';

export type IMusic = {
  id: string;
  musicianId: string;
  musician?: IMusician;
  name: string;
  image: string;
  listenAmount: number;
};
