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
import { IBestOf } from '../../local_core';

export type CreationModelBestOf = Partial<IBestOf>;

@DefaultScope(() => ({}))
@Scopes(() => ({}))
@Table({ tableName: 'bestOf', paranoid: false, timestamps: true })
export class BestOf extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Default(() => uuidv4())
  @Column
  id: string;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  index: number;

  @AllowNull(false)
  @Column(DataType.STRING(1023))
  url: string;
}
