import { IEvent } from './../../local_core/types/interface/models/event.model';
import { HttpResponseError } from '../../modules/http-response-error';
import { Controller } from '../../core';
import { Request } from 'express';
import EventValidation from '../validations/event.validation';
import { Event } from '../../database';
import { Op } from 'sequelize';
import { checkRoleRights } from '../../utils/auth.utils';
import { EventTypeEnum } from '../../local_core';

export interface IEventCreateBody {
  date: Date;
  image: string;
  title: string;
  place: string;
  type: EventTypeEnum;
}

export interface IEventUpdateBody {
  id: string;
  date: Date;
  image: string;
  title: string;
  place: string;
  type: EventTypeEnum;
}

export interface IEventResponse {
  event: IEvent;
}

export interface IEventListResponse {
  events: IEvent[];
}

export interface IDeleteOrGetEventBody {
  id: string;
}

export interface IEventByDateBody {
  before: Date;
  after: Date;
  type: EventTypeEnum;
}

class EventController implements Controller {
  async create(
    req: Request<Record<string, never>, IEventResponse, IEventCreateBody>,
    res: any,
  ): Promise<void> {
    checkRoleRights(1, res.locals.currentUser);
    req.body = EventValidation.eventCreateBody(req.body);
    const event = await Event.create({
      date: req.body.date,
      image: req.body.image,
      title: req.body.title,
      place: req.body.place,
      type: req.body.type,
    });

    res.json({ data: { event } });
  }

  async update(
    req: Request<Record<string, never>, IEventResponse, IEventUpdateBody>,
    res: any,
  ): Promise<void> {
    checkRoleRights(1, res.locals.currentUser);
    req.body = EventValidation.eventUpdateBody(req.body);
    const event = await Event.findOne({
      where: {
        id: req.body.id,
      },
    });

    if (!event) {
      throw HttpResponseError.createNotFoundError();
    }

    await event.update({
      date: req.body.date,
      image: req.body.image,
      title: req.body.title,
      place: req.body.place,
      type: req.body.type,
    });

    await event.save();
    await event.reload();

    res.json({ data: { event } });
  }

  async get(
    req: Request<Record<string, never>, IEventResponse, IDeleteOrGetEventBody>,
    res: any,
  ): Promise<void> {
    req.body = EventValidation.deleteOrGetEventBody(req.body);
    const event = await Event.findOne({
      where: {
        id: req.body.id,
      },
    });

    if (!event) {
      throw HttpResponseError.createNotFoundError();
    }

    res.json({ data: { event } });
  }

  async getAll(req: Request<Record<string, never>, any>, res: any): Promise<void> {
    checkRoleRights(1, res.locals.currentUser);
    const event = await Event.findAll();

    if (!event) {
      throw HttpResponseError.createNotFoundError();
    }

    res.json({ data: { event } });
  }

  async getByDate(
    req: Request<Record<string, never>, IEventListResponse, IEventByDateBody>,
    res: any,
  ): Promise<void> {
    req.body = EventValidation.eventByDate(req.body);
    const events = await Event.findAll({
      where: {
        date: {
          [Op.between]: [req.body.after, req.body.before],
        },
        type: req.body.type,
      },
    });

    res.json({ data: { events } });
  }

  async delete(
    req: Request<Record<string, never>, IEventResponse, void, IDeleteOrGetEventBody>,
    res: any,
  ): Promise<void> {
    checkRoleRights(1, res.locals.currentUser);
    req.query = EventValidation.deleteOrGetEventBody(req.query);
    const event = await Event.findOne({
      where: {
        id: req.query.id,
      },
    });

    if (!event) {
      throw HttpResponseError.createNotFoundError();
    }

    await event.destroy();

    res.json({ data: { event } });
  }
}

export default new EventController();
