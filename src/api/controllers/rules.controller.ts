import { Controller, ILocals } from '../../core';
import { checkRoleRights } from '../../utils/auth.utils';
import { EventTypeEnum, IResponse } from '../../local_core';
import { Request, Response } from 'express';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { createFileSync } from 'fs-extra';

export interface IRulesUpdateBody {
  rulesData: any;
  serverType: EventTypeEnum;
}

class RulesController implements Controller {
  async update(
    req: Request<Record<string, never>, void, IRulesUpdateBody>,
    res: Response<IResponse<void>, ILocals>,
  ): Promise<void> {
    checkRoleRights(1, res.locals.currentUser);

    if (!existsSync(`./rules_config_${req?.body?.serverType}.json`)) {
      createFileSync(`./rules_config_${req?.body?.serverType}.json`);
    }
    writeFileSync(
      `./rules_config_${req?.body?.serverType}.json`,
      JSON.stringify(req?.body?.rulesData),
    );

    res.send();
  }

  async get(req: Request, res: Response): Promise<void> {
    try {
      const data = readFileSync(`./rules_config_0.json`, 'utf-8');
      const data2 = readFileSync(`./rules_config_1.json`, 'utf-8');
      res.json([JSON.parse(data), JSON.parse(data2)]);
    } catch {
      res.json([]);
    }
  }
}

export default new RulesController();
