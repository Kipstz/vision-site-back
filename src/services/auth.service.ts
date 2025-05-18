import { HttpResponseError } from './../modules/http-response-error';
import jws from 'jsonwebtoken';
import AppConfig from '../modules/app-config.module';
import url from 'url';
import axios from 'axios';
import { User } from '../database';

type ParamsOauth = {
  code: string;
};

type DiscordOAuth2UserResponse = {
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
  data?: any;
};

type DiscordOAuth2CredentialsResponse = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
};

type ResultOAuth = {
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

type SessionTokenOptions = {
  secretToken: string;
  expiration: string;
};

class AuthService {
  public token(user: User, unlimited?: boolean, options?: Partial<SessionTokenOptions>): string {
    return jws.sign({ UUID: user?.id, ...options }, AppConfig.config.app.auth.secretToken, {
      ...(!unlimited ? { expiresIn: AppConfig.config.app.auth.expiration } : {}),
    });
  }

  public async oauthDiscord(params: ParamsOauth): Promise<ResultOAuth> {
    try {
      const { data: credentials } = await axios.post<DiscordOAuth2CredentialsResponse>(
        'https://discord.com/api/oauth2/token' ?? '',
        new url.URLSearchParams({
          client_id: process.env.OAUTH_CLIENT_ID ?? '',
          client_secret: process.env.OAUTH_CLIENT_SECRET ?? '',
          grant_type: 'authorization_code',
          code: params.code,
          redirect_uri: process.env.OAUTH_REDIRECT_URL ?? '',
        }).toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );

      const { data: user } = await axios.get<DiscordOAuth2UserResponse>(
        process.env.OAUTH_URL_USER ?? '',
        { headers: { Authorization: `Bearer ${credentials.access_token}` } },
      );

      const { data: info } = await axios.get<any>(
        `https://discord.com/api/users/@me/guilds/${process.env.DISCORD_SERVER_ID ?? ''}/member`,
        { headers: { Authorization: `Bearer ${credentials.access_token}` } },
      );

      user.data = info;

      return { oauthUser: user, credentials, info };
    } catch (error: any) {
      console.log(error);
      if (error.response?.status === 404) throw HttpResponseError.createNotInServer();

      throw HttpResponseError.createInternalServerError();
    }
  }
}
export default new AuthService();
