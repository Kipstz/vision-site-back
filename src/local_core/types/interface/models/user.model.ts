import { DiscordRoleEnum } from '../../../enums/discord-role.enum';

export type IUser = {
  id: string;
  discordId: string;
  twitchUrl: string;
  role: DiscordRoleEnum;
  discordName: string;
  discordTag: string;
  discordAvatar: string;
  isLive: boolean | null;
  viewCount: number | null;
  twitchLogo: string | null;
  twitchLiveTitle: string | null;
  twitchName: string | null;
  isPlayingVision: boolean | null;
  twitchThumbnail: string | null;
};
