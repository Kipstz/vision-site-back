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
import { IUser, Overwrite } from '../../local_core';
import { DiscordRoleEnum } from '../../local_core/enums/discord-role.enum';

export type ModelUser = Overwrite<
  IUser,
  {
    //
  }
>;

export type CreationModelUser = Partial<IUser>;

@DefaultScope(() => ({}))
@Scopes(() => ({}))
@Table({ tableName: 'user', paranoid: false, timestamps: true })
export class User extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Default(() => uuidv4())
  @Column
  id: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  discordId: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
  })
  twitchUrl: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
  })
  discordTag: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
  })
  discordName: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
  })
  discordAvatar: string;

  @AllowNull(true)
  @Column({
    type: DataType.INTEGER,
  })
  role: DiscordRoleEnum;

  @AllowNull(true)
  @Column({
    type: DataType.BOOLEAN,
  })
  isLive: boolean;

  @AllowNull(true)
  @Column({
    type: DataType.INTEGER,
  })
  viewCount: number;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
  })
  twitchLogo: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
  })
  twitchLiveTitle: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
  })
  twitchName: string;

  @AllowNull(true)
  @Column({
    type: DataType.BOOLEAN,
  })
  isPlayingVision: boolean;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
  })
  twitchThumbnail: string;
}
