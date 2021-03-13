import service from './service';

import { Throtthler, EventEntry } from '../helpers/runtypes';
import { ListOfVerifications, ResultOfEventsVerifications } from '../helpers/interfaces';

export async function throttler(
    events: Throtthler,
    state: EventEntry,
    now: number
): Promise<{
    allow: boolean;
    data: ResultOfEventsVerifications;
    newState: EventEntry | null;
}> {
    const result: ListOfVerifications = {
        resultOfTotalPointsSize: { allow: false, reason: '' },
        resultOfPoints: { allow: false, reason: '' },
        resultOfSumEvents: { allow: false, reason: '' },
    };

    for (const eventName of Object.keys(events)) {
        for (const throttler of events[eventName].throttlers) {
            const { points }: { points: number } = events[eventName];

            if (throttler.kind === 'points') {
                if (throttler.per !== undefined) {
                    result.resultOfTotalPointsSize = await service.checkAmountOfPointsOfAllEventsPerSomeTime(
                        eventName,
                        throttler.max,
                        throttler.per,
                        now,
                        state
                    );
                    service.writeResultOfThrottler(result.resultOfTotalPointsSize);
                } else if (throttler.per === undefined) {
                    result.resultOfPoints = await service.checkPointsSizeWithMaxPoints(points, throttler.max);
                    service.writeResultOfThrottler(result.resultOfPoints);
                }
            }

            if (throttler.kind === 'count') {
                if (throttler.per !== undefined) {
                    result.resultOfSumEvents = await service.checkAmountOfAllEventsPerSomeTime(
                        eventName,
                        throttler.max,
                        throttler.per,
                        now,
                        state
                    );
                    service.writeResultOfThrottler(result.resultOfSumEvents);
                }
            }
        }
        service.writeResultOfEvent(eventName);
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
