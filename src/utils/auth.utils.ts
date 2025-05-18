import { IUser } from '../local_core';
import { DiscordRoleEnum } from '../local_core/enums/discord-role.enum';
import { HttpResponseError } from '../modules/http-response-error';

export const checkRoleRights = (roleId: DiscordRoleEnum, user: IUser): void => {
  if (user.role > roleId) {
    throw HttpResponseError.createUnauthorized();
  }
};

export const getHighestRole = (roles: string[]): DiscordRoleEnum => {
  let role = 99;
  const allRolesKey = Object.keys(DiscordRoleEnum).filter((e) => typeof e !== 'number');

  allRolesKey.forEach((key: string) => {
    if (
      roles.includes(process.env?.[key + '_ID'] ?? '') &&
      DiscordRoleEnum[key as keyof typeof DiscordRoleEnum] < role
    ) {
      role = DiscordRoleEnum[key as keyof typeof DiscordRoleEnum];
    }
  });

  return role;
};
