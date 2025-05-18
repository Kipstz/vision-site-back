import {
  DataType,
  Column,
  IsUUID,
  PrimaryKey,
  Table,
  DefaultScope,
  Scopes,
  Default,
  Model,
  BelongsTo,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { Overwrite } from '../../local_core';
import { ICharacter } from '../../local_core/types/interface/models/character.model';
import { Character } from './character.model';
import { Music } from './music.model';
import { IMusic } from '../../local_core/types/interface/models/music.model';

export type ModelUser = Overwrite<
  ICharacter,
  {
    musics: Music[];
  }
>;

@DefaultScope(() => ({}))
@Scopes(() => ({}))
@Table({ tableName: 'musician', paranoid: false, timestamps: true })
export class Musician extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Default(() => uuidv4())
  @Column
  id: string;

  @ForeignKey(() => Character)
  @Column({
    type: DataType.STRING,
  })
  characterId: string;

  @BelongsTo(() => Character)
  character: ICharacter;

  @Column({
    type: DataType.STRING,
  })
  stageName: string;

  @Column({
    type: DataType.STRING,
  })
  banner: string;

  @Column({
    type: DataType.STRING,
  })
  profilePicture: string;

  @Column({
    type: DataType.BOOLEAN,
  })
  isCertified: boolean;

  @Column({
    type: DataType.STRING,
  })
  youtubeLink: string;

  @HasMany(() => Music)
  musics: IMusic[];
}
