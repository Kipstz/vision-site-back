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
import { IMusician } from '../../local_core/types/interface/models/musician.model';
import { Musician } from './musician.model';
import { IMusic } from '../../local_core/types/interface/models/music.model';

export type ModelUser = Overwrite<
  IMusic,
  {
    musician: Musician;
  }
>;

export type CreationModelUser = Partial<IMusic>;

@DefaultScope(() => ({}))
@Scopes(() => ({}))
@Table({ tableName: 'music', paranoid: false, timestamps: true })
export class Music extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Default(() => uuidv4())
  @Column
  id: string;

  @ForeignKey(() => Musician)
  @Column({
    type: DataType.STRING,
  })
  musicianId: string;

  @BelongsTo(() => Musician)
  musician: IMusician;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  name: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  image: string;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  listenAmount: number;
}
