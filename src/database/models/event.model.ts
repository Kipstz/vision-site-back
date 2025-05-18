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
import { EventTypeEnum, IEvent } from '../../local_core';

export type CreationModelEvent = Partial<IEvent>;

@DefaultScope(() => ({}))
@Scopes(() => ({}))
@Table({ tableName: 'event', paranoid: false, timestamps: true })
export class Event extends Model {
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

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  title: string;

  @AllowNull(false)
  @Default(0)
  @Column({
    type: DataType.INTEGER,
  })
  type: EventTypeEnum;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  place: string;
}
