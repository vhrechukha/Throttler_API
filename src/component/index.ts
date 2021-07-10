import service from './service';

import { ThrottlerRequest, ThrottlerState } from '../helpers/runtypes';
import { ResultOfEventsVerifications } from '../helpers/interfaces';

export async function throttler(events: ThrottlerRequest, state: ThrottlerState, now: number): Promise<any> {
    let allow;
    const resultOfEventsVerifications: ResultOfEventsVerifications = {};

    for (const eventName of Object.keys(events)) {
        resultOfEventsVerifications[eventName] = {
            allow: [],
            reason: '',
        };

        for (const throttler of events[eventName].throttlers) {
            const { points }: { points: number } = events[eventName];
            const resultOfEvent = resultOfEventsVerifications[eventName];

            if (throttler.per) {
                const result = await service.checkAmountPerSomeTimeOf(
                    throttler.kind,
                    throttler.per,
                    throttler.max,
                    state,
                    eventName
                );

                resultOfEvent.allow.push(result.allow);

                if (result.reason) {
                    resultOfEvent.reason = resultOfEvent.reason?.concat(result.reason);
                    allow = false;
                }
            } else {
                const result = await service.checkPointsSizeWithMaxPoints(points, throttler.max);

                resultOfEvent.allow.push(result.allow);

                if (result.reason) {
                    resultOfEvent.reason = resultOfEvent.reason?.concat(result.reason);
                    allow = false;
                }
            }
        }
    }

    return {
        allow,
        data: resultOfEventsVerifications,
        state: allow ? service.addEvents(state, events, now) : null,
    };
}
