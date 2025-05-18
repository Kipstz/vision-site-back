import { Op } from 'sequelize';
import { Controller } from '../../core';
import { Request } from 'express';
import { User } from '../../database';
import { IUser } from '../../local_core';

export interface IGetStreamersResponse {
  streamers: Partial<IUser>[];
}

class StreamingController implements Controller {
  async getAll(
    req: Request<Record<string, never>, IGetStreamersResponse, void>,
    res: any,
  ): Promise<void> {
    const streamers = await User.findAll({
      where: {
        twitchUrl: {
          [Op.ne]: null,
        },
      },
      attributes: {
        exclude: [
          'createdAt',
          'password',
          'updatedAt',
          'discordId',
          'discordName',
          'discordTag',
          'id',
          'isLive',
          'isPlayingVision',
          'role',
          'twitchLiveLogo',
          'viewCount',
          'twitchLiveTitle',
        ],
      },
    });

    res.json({ data: { streamers } });
  }

  async getStreamingVision(
    req: Request<Record<string, never>, IGetStreamersResponse, void>,
    res: any,
  ): Promise<void> {
    const streamers = await User.findAll({
      where: {
        twitchUrl: {
          [Op.ne]: null,
        },
        isLive: true,
        isPlayingVision: true,
      },
      attributes: {
        exclude: ['createdAt', 'password', 'updatedAt'],
      },
    });

    res.json({ data: { streamers } });
  }
}

export default new StreamingController();
