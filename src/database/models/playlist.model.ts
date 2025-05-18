import {
  Column,
  IsUUID,
  PrimaryKey,
  Table,
  DefaultScope,
  Scopes,
  Default,
  Model,
  BelongsToMany,
  AllowNull,
  DataType,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { Overwrite } from '../../local_core';
import { Music } from './music.model';
import { PlayListMusic } from './playlist-music';
import { IPlayList } from '../../local_core/types/interface/models/playlist.model';

export type ModelUser = Overwrite<
  IPlayList,
  {
    //
  }
>;

export type CreationModelUser = Partial<IPlayList>;

@DefaultScope(() => ({}))
@Scopes(() => ({}))
@Table({ tableName: 'playList', paranoid: false, timestamps: true })
export class PlayList extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Default(() => uuidv4())
  @Column
  id: string;

  @BelongsToMany(() => Music, { through: () => PlayListMusic, onDelete: 'CASCADE' })
  musics: Music[];

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  name: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
  })
  description: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
  })
  image: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  userId: string;
}
