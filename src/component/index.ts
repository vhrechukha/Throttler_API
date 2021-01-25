import service from './service';

import Event from './interfaces/event-interface';
import ThrottlerParams from './interfaces/throttlerParams-interface';
import ListOfVerifications from './interfaces/listOfVerifications-interface';
import { PerInEventRuntypeExist, PerInEventRuntypeNotExist } from './interfaces/runtypes';
import ResultOfEventsVerifications from './interfaces/resultOfEventsVerifications-interface';
import EventEntry from './interfaces/eventEntry-interface';

export async function throttler(
    data: {
        events: Event;
    },
    state: EventEntry[],
    now: number
): Promise<{
    allow: boolean;
    data: ResultOfEventsVerifications;
    newState: EventEntry[] | null;
}> {
    const { events }: { events: Event } = data;
    const result: ListOfVerifications = {
        resultOfTotalPointsSize: { allow: false, reason: '' },
        resultOfPoints: { allow: false, reason: '' },
        resultOfSumEvents: { allow: false, reason: '' },
    };

    for (const event of Object.keys(events)) {
        for (const element in events[event].throttlers) {
            const { points }: { points: number } = events[event];

            const throttler: ThrottlerParams = events[event].throttlers[element];

            if (throttler.kind === 'points') {
                if (PerInEventRuntypeExist.guard(throttler)) {
                    result.resultOfTotalPointsSize = await service.checkAmountOfPointsOfAllEventsPerSomeTime(
                        event,
                        throttler.max,
                        throttler.per,
                        now,
                        state
                    );
                    service.writeResult(result.resultOfTotalPointsSize);
                } else if (PerInEventRuntypeNotExist.guard(throttler)) {
                    result.resultOfPoints = await service.checkPointsSizeWithMaxPoints(points, throttler.max);
                    service.writeResult(result.resultOfPoints);
                }
            }

            if (throttler.kind === 'count') {
                if (PerInEventRuntypeExist.guard(throttler)) {
                    result.resultOfSumEvents = await service.checkAmountOfAllEventsPerSomeTime(
                        event,
                        throttler.max,
                        throttler.per,
                        now,
                        state
                    );
                    service.writeResult(result.resultOfSumEvents);
                }
            }
        }
        service.writeResultOfEvent(event);
    }

    const resultOfVerificationEvents = service.getResultOfEventsVerification();
    if (resultOfVerificationEvents.allow) {
        return {
            allow: resultOfVerificationEvents.allow,
            data: resultOfVerificationEvents.result,
            newState: service.addEvents(events, now, state),
        };
    }

    return {
        allow: resultOfVerificationEvents.allow,
        data: resultOfVerificationEvents.result,
        newState: null,
    };
}
