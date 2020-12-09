import { HttpError } from '../error';
import { NextFunction, Request, Response } from 'express';
import service from './service';
import { ResultOfEvents } from './interfaces/result-interface';
import { PerInEventRuntype } from './interfaces/runtypes';

export async function throtthler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { events } = req.body;

    const resultOfEvents: ResultOfEvents = {};
    let allow = true;

    let permissionOfEvent, reasonOfEvent;

    let resultOfTotalPointsSize, resultOfPoints, resultOfTotalEvents;

    await service.addFakeEvents(); // it's only for fake events in DB(u can delete this line)

    for (const event of Object.keys(events)) {
      permissionOfEvent = [];
      reasonOfEvent = [];

      for (const element in events[event].throttlers) {
        const { points } = events[event];
        const throttler = events[event].throttlers[element];

        if (throttler.kind === 'points') {
          if (PerInEventRuntype.guard(throttler)) {
            // check total points size per some period of time
            resultOfTotalPointsSize = await service.checkTotalPointsSize(
              event,
              throttler.max,
              throttler.per,
            );

            permissionOfEvent.push(resultOfTotalPointsSize.allow);

            if (resultOfTotalPointsSize.reason !== '')
              reasonOfEvent.push(resultOfTotalPointsSize.reason);
          } else {
            // check points size with some max points
            resultOfPoints = await service.checkPoints(points, throttler.max);

            permissionOfEvent.push(resultOfPoints.allow);

            if (resultOfPoints.reason !== '')
              reasonOfEvent.push(resultOfPoints.reason);
          }
        }
        if (throttler.kind === 'count') {
          // check amount of documents per some period of time
          resultOfTotalEvents = await service.checkTotalEvents(
            event,
            throttler.max,
            throttler.per,
          );

          permissionOfEvent.push(resultOfTotalEvents.allow);

          if (resultOfTotalEvents.reason !== '')
            reasonOfEvent.push(resultOfTotalEvents.reason);
        }
      }

      if (reasonOfEvent.length) {
        resultOfEvents[event] = {
          allow: permissionOfEvent,
          reason: reasonOfEvent.join(' ,'),
        };
        allow = false;
      } else resultOfEvents[event] = { allow: permissionOfEvent };
    }

    if (allow) service.addEvents(events);

    res.status(200).json({
      allow,
      data: resultOfEvents,
    });
  } catch (error) {
    next(new HttpError(error.message.status, error.message));
  }
}
