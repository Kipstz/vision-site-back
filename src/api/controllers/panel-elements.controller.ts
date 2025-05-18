import { HttpResponseError } from '../../modules/http-response-error';
import { Controller, ILocals } from '../../core';
import { Request, Response } from 'express';
import { IPanelElement, IResponse } from '../../local_core';
import { checkRoleRights } from '../../utils/auth.utils';
import PanelElementsValidation from '../validations/panel-elements.validation';
import { PanelElement } from '../../database';

export interface IPanelElementCreateBody {
  image: string;
  label: string;
  color: string;
  link: string;
  category: string;
}

export interface IPanelElementUpdateBody {
  id: string;
  image: string;
  label: string;
  link: string;
  color: string;
  category: string;
}

export interface IPanelElementListResponse {
  panelElement: IPanelElement[];
}

export interface IPanelElementResponse {
  panelElement: IPanelElement;
}

export interface IDeleteOrGetPanelElementBody {
  id?: string;
}

class PanelElementController implements Controller {
  async create(
    req: Request<Record<string, never>, IPanelElementResponse, IPanelElementCreateBody>,
    res: Response<IResponse<IPanelElementResponse>, ILocals>,
  ): Promise<void> {
    checkRoleRights(1, res.locals.currentUser);
    req.body = PanelElementsValidation.panelElementCreateBody(req.body);
    const panelElement = await PanelElement.create({
      label: req.body.label,
      link: req.body.link,
      image: req.body.image,
      category: req.body.category,
      color: req.body.color,
    });

    res.json({ data: { panelElement } });
  }

  async update(
    req: Request<Record<string, never>, IPanelElementResponse, IPanelElementUpdateBody>,
    res: Response<IResponse<IPanelElementResponse>, ILocals>,
  ): Promise<void> {
    checkRoleRights(1, res.locals.currentUser);
    req.body = PanelElementsValidation.panelElementUpdateBody(req.body);
    const panelElement = await PanelElement.findOne({
      where: {
        id: req.body.id,
      },
    });

    if (!panelElement) {
      throw HttpResponseError.createNotFoundError();
    }

    await panelElement.update({
      label: req.body.label,
      link: req.body.link,
      image: req.body.image,
      category: req.body.category,
      color: req.body.color,
    });

    await panelElement.save();
    await panelElement.reload();

    res.json({ data: { panelElement } });
  }

  async delete(
    req: Request<Record<string, never>, IPanelElementResponse, void, IDeleteOrGetPanelElementBody>,
    res: Response<IResponse<IPanelElementResponse>, ILocals>,
  ): Promise<void> {
    checkRoleRights(1, res.locals.currentUser);
    req.query = PanelElementsValidation.deleteOrGetPanelElementBody(req.query);
    const panelElement = await PanelElement.findOne({
      where: {
        id: req.query.id,
      },
    });

    if (!panelElement) {
      throw HttpResponseError.createNotFoundError();
    }

    await panelElement.destroy();

    res.json({ data: { panelElement } });
  }

  async getAll(req: Request<Record<string, never>, any>, res: any): Promise<void> {
    const panelElement = await PanelElement.findAll();

    if (!panelElement) {
      throw HttpResponseError.createNotFoundError();
    }

    res.json({ data: { panelElement } });
  }
}

export default new PanelElementController();
