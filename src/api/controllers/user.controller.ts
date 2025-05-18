import { Request, Response } from 'express';
import { ILocals } from '../../core';
import { User } from '../../database';
import { checkRoleRights, getHighestRole } from '../../utils/auth.utils';
import { IResponse } from '../../local_core';
import { HttpResponseError } from '../../modules/http-response-error';
import { Client, GatewayIntentBits } from 'discord.js';

class UserController {
  async me(
    req: Request<Record<string, never>, any, void>,
    res: Response<any, ILocals>,
  ): Promise<void> {
    const user = await User.findOne({
      where: {
        id: res.locals.currentUser.id,
      },
      attributes: {
        exclude: ['createdAt', 'password', 'updatedAt', 'username'],
      },
    });

    res.status(200).json({
      user: user,
    });
  }

  async update(
    req: Request<Record<string, never>, any, any>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    checkRoleRights(1, res.locals.currentUser);
    const user = await User.findOne({
      where: {
        id: req.body.id,
      },
    });

    if (!user) {
      throw HttpResponseError.createNotFoundError();
    }

    await user.update({
      twitchUrl: req.body.twitchUrl,
    });

    await user.save();
    await user.reload();

    res.json({ data: { user } });
  }

  async updateDiscord(
    req: Request<Record<string, never>, any, any>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    checkRoleRights(1, res.locals.currentUser);

    const client = new Client({
      intents: [
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildPresences,
      ],
    });
    await client.login(process.env.DISCORD_BOT_TOKEN);

    const guild = await client.guilds.fetch(process.env.DISCORD_SERVER_ID ?? '');
    const guildMembers = await guild.members.fetch();
    const users = await User.findAll();
    const array = guildMembers.map((member: any) => {
      const highestRole = getHighestRole(member._roles);
      const user = users.find((e) => e.discordId === member.user.id);
      return {
        ...(user ? { id: user.id } : {}),
        discordId: member.user.id,
        role: highestRole,
        discordTag: member.user.discriminator,
        discordName: member.user.username,
        discordAvatar: member.user.avatar,
      };
    });

    await User.bulkCreate(array, {
      updateOnDuplicate: ['discordName', 'discordTag', 'role', 'discordAvatar'],
    });

    client.destroy();

    res.json({ data: { updated: true } });
  }

  async all(
    req: Request<Record<string, never>, any, void>,
    res: Response<any, ILocals>,
  ): Promise<void> {
    checkRoleRights(0, res.locals.currentUser);
    const users = await User.findAll({
      attributes: {
        exclude: ['createdAt', 'password', 'updatedAt'],
      },
    });

    res.status(200).json({
      users: users,
    });
  }
}

export default new UserController();
