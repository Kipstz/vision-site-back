import {
  Column,
  IsUUID,
  PrimaryKey,
  Table,
  DefaultScope,
  Scopes,
  Default,
  Model,
  ForeignKey,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { Overwrite } from '../../local_core';
import { Music } from './music.model';
import { IPlayList } from '../../local_core/types/interface/models/playlist.model';
import { PlayList } from './playlist.model';

export type ModelUser = Overwrite<
  IPlayList,
  {
    //
  }
>;

export type CreationModelUser = Partial<IPlayList>;

@DefaultScope(() => ({}))
@Scopes(() => ({}))
@Table({ tableName: 'playListMusic', paranoid: false, timestamps: true })
export class PlayListMusic extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Default(() => uuidv4())
  @Column
  id: string;

  @ForeignKey(() => Music)
  @PrimaryKey
  @Column
  musicId: string;

  @ForeignKey(() => PlayList)
  @PrimaryKey
  @Column
  playListId: string;
}
