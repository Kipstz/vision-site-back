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
import { IPanelElement } from '../../local_core';

export type CreationModelPanelElement = Partial<IPanelElement>;

@DefaultScope(() => ({}))
@Scopes(() => ({}))
@Table({ tableName: 'panelElement', paranoid: false, timestamps: false })
export class PanelElement extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Default(() => uuidv4())
  @Column
  id: string;

  @AllowNull(false)
  @Column(DataType.STRING(1023))
  image: string;

  @AllowNull(false)
  @Column(DataType.STRING(1023))
  link: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  label: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  category: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  color: string;
}
