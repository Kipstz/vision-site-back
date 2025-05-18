import {
  DataType,
  Column,
  IsUUID,
  PrimaryKey,
  Table,
  DefaultScope,
  Scopes,
  Default,
  AllowNull,
  Model,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { Overwrite } from '../../local_core';
import { Music } from './music.model';
import { IFavorite } from '../../local_core/types/interface/models/favorite.model';

export type ModelUser = Overwrite<
  IFavorite,
  {
    //
  }
>;

export type CreationModelUser = Partial<IFavorite>;

@DefaultScope(() => ({}))
@Scopes(() => ({}))
@Table({ tableName: 'favorite', paranoid: false, timestamps: true })
export class Favorite extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Default(() => uuidv4())
  @Column
  id: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  userId: string;

  @ForeignKey(() => Music)
  @Column({
    type: DataType.STRING,
  })
  musicId: string;

  @BelongsTo(() => Music)
  music: Music;
}
