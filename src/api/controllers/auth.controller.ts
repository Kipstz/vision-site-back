import { Request, Response } from 'express';
import { IResponse, IResponseLocals, IUser } from '../../local_core';
import { User } from '../../database';
import authService from '../../services/auth.service';
import { getHighestRole } from '../../utils/auth.utils';

export type ResultOAuth = {
  credentials: {
    access_token: string;
    access_token_secret?: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    token_type: string;
  };
  oauthUser: { id: string; username: string };
  info: any;
};

export type DiscordOAuth2UserResponse = {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  email?: string;
  verified?: boolean;
  public_flags: number;
  flags: number;
  banner: string | null;
  banner_color: string | null;
  accent_color: string | null;
  locale: string;
  mfa_enabled: boolean;
};

export type DiscordOAuth2CredentialsResponse = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
};

export interface IOAuthAuthBody {
  code: string;
  accessToken?: string;
  accessSecret?: string;
}

export interface IOAuthAuthData {
  user: IUser;
  sid: string;
}
export type IOAuthAuthResponse = IResponse<IOAuthAuthData>;

class AuthController {
  async oauth(
    req: Request<any, any, IOAuthAuthBody>,
    res: Response<IOAuthAuthResponse, IResponseLocals>,
  ): Promise<void> {
    const result: ResultOAuth = await authService.oauthDiscord({
      code: req.body.code.toString(),
    });

    const { oauthUser, info } = result;

    let user = await User.findOne({
      where: {
        discordId: oauthUser.id,
      },
    });

    const highestRole = getHighestRole(info.roles);

    if (!user) {
      user = await User.create({
        discordId: oauthUser.id,
        role: highestRole,
        discordTag: info.user.discriminator,
        discordName: info.user.username,
        discordAvatar: info.user.avatar,
      });
    } else {
      user.role = highestRole;
      user.discordTag = info.user.discriminator;
      user.discordName = info.user.username;
      user.discordAvatar = info.user.avatar;
      await user.save();
    }

    const token = authService.token(user);

    res.cookie('sid', token);
    res.status(200).json({
      data: { sid: token, user: user },
    });
  }
}

export default new AuthController();
