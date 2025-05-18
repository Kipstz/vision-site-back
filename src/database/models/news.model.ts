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
import { EventTypeEnum, INews } from '../../local_core';
import { Character } from './character.model';

export type CreationModelNews = Partial<INews>;

@DefaultScope(() => ({}))
@Scopes(() => ({}))
@Table({ tableName: 'news', paranoid: false, timestamps: true })
export class News extends Model {
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
  media: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  title: string;

  @Column({
    type: DataType.TEXT,
  })
  content: string;

  @ForeignKey(() => Character)
  @Column({
    type: DataType.STRING,
  })
  characterId: string;

  @BelongsTo(() => Character)
  character: Character;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  type: 'video' | 'text';

  @AllowNull(false)
  @Default(0)
  @Column({
    type: DataType.INTEGER,
  })
  serverType: EventTypeEnum;
}
