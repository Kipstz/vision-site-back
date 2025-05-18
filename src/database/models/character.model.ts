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
import { ICharacter } from '../../local_core/types/interface/models/character.model';
import { RPCharacterJobEnum } from '../../local_core/enums/rp-character-job.enum';
import { User } from './user.model';

export type ModelUser = Overwrite<
  ICharacter,
  {
    user: User;
  }
>;

export type CreationModelUser = Partial<ICharacter>;

@DefaultScope(() => ({}))
@Scopes(() => ({}))
@Table({ tableName: 'character', paranoid: false, timestamps: true })
export class Character extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Default(() => uuidv4())
  @Column
  id: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  firstName: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  lastName: string;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  job: RPCharacterJobEnum;

  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
  })
  userId: string;

  @BelongsTo(() => User)
  user: User;
}
