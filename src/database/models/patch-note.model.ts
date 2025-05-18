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
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { IPatchNote } from '../../local_core';

export type CreationModelPatchNote = Partial<IPatchNote>;

@DefaultScope(() => ({}))
@Scopes(() => ({}))
@Table({ tableName: 'patchNote', paranoid: false, timestamps: true })
export class PatchNote extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Default(() => uuidv4())
  @Column
  id: string;

  @AllowNull(false)
  @Column({
    type: DataType.DATE,
  })
  date: Date;

  @AllowNull(false)
  @Column(DataType.STRING(1023))
  image: string;
}
