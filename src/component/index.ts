import service from './service';
import { HttpError } from '../error';
import { NextFunction, Request, Response } from 'express';
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

    let permissionsForEvent, failureReasonForEvent;

    let resultOfTotalPointsSize, resultOfPoints, resultOfSumEvents;

    await service.addFakeEvents(); // it's only for fake events in DB(u can delete this line)

    for (const event of Object.keys(events)) {
      permissionsForEvent = [];
      failureReasonForEvent = [];

      for (const element in events[event].throttlers) {
        const { points } = events[event];
        const throttler = events[event].throttlers[element];

        if (throttler.kind === 'points') {
          if (PerInEventRuntype.guard(throttler)) {
            resultOfTotalPointsSize = await service.checkAmountsOfPointsOfAllEventsPerSomeTime(
              event,
              throttler.max,
              throttler.per,
            );

            permissionsForEvent.push(resultOfTotalPointsSize.allow);

            if (resultOfTotalPointsSize.reason !== '')
              failureReasonForEvent.push(resultOfTotalPointsSize.reason);
          } else {
            resultOfPoints = await service.checkPointsSizeWithMaxPoints(
              points,
              throttler.max,
            );

            permissionsForEvent.push(resultOfPoints.allow);

            if (resultOfPoints.reason !== '')
              failureReasonForEvent.push(resultOfPoints.reason);
          }
        }

        if (throttler.kind === 'count') {
          resultOfSumEvents = await service.checkAmountOfAllEventsPerSomeTime(
            event,
            throttler.max,
            throttler.per,
          );

          permissionsForEvent.push(resultOfSumEvents.allow);

          if (resultOfSumEvents.reason !== '')
            failureReasonForEvent.push(resultOfSumEvents.reason);
        }
      }

      if (failureReasonForEvent.length) {
        resultOfEvents[event] = {
          allow: permissionsForEvent,
          reason: failureReasonForEvent.join(' ,'),
        };
        allow = false;
      } else {
        resultOfEvents[event] = { allow: permissionsForEvent };
      }
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
