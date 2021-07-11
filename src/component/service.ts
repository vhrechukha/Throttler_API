import { PerType, ThrottlerRequest, ThrottlerState } from '../helpers/runtypes';
import { ResultOfVerification } from '../helpers/interfaces';

import getDateDiff from '../helpers/getDateDiff';
import getDateResolution from '../helpers/getDateResolution';

const Service = {
    async checkPointsSizeWithMaxPoints(points: number, maxPoints: number): Promise<ResultOfVerification> {
        const Allow = points < maxPoints;

        return {
            allow: Allow,
            reason: Allow ? '' : `> ${maxPoints} points`,
        };
    },
    async checkAmountPerSomeTimeOf(
        kind: string,
        per: PerType,
        max: number,
        state: ThrottlerState,
        eventName: string
    ): Promise<ResultOfVerification> {
        let amount = 0;

        const eventInState = state[eventName];

        if (!eventInState || !eventInState[per]) {
            return {
                allow: true,
                reason: '',
            };
        }

        const eventsInEventInState = eventInState[per]?.events!;

        if (kind === 'count') amount = eventsInEventInState.reduce((a: number, event) => (event ? a + event.count : 0), 0);
        else amount = eventsInEventInState.reduce((a: number, event) => (event ? a + event.points : 0), 0);

        const Allow = max > amount;

        return {
            allow: Allow,
            reason: Allow ? '' : `> ${max} ${kind} per ${per}`,
        };
    },
    addEvents(state: ThrottlerState, events: ThrottlerRequest, now: number): ThrottlerState {
        for (const eventName of Object.keys(events)) {
            for (const throttler of events[eventName].throttlers) {
                const throttlerPer = throttler.per || '1000d';

                let eventInState = state[eventName]?.[throttlerPer]!;

                const throttlerPoints = events[eventName].points;
                const throttlerResolution =
                    throttler.resolution || eventInState?.events.length || getDateResolution[throttlerPer];

                if (!eventInState) {
                    const array = new Array(throttlerResolution - 1).fill(null);

                    state[eventName] = {
                        ...state[eventName],
                        [throttlerPer]: {
                            events: [
                                ...array,
                                {
                                    count: 1,
                                    points: throttlerPoints,
                                },
                            ],
                            lastAddedTime: now,
                            lastUpdatedTime: now,
                        },
                    };

                    continue;
                }

                const lastAddedTimeInPeriod = eventInState.lastAddedTime + getDateDiff[throttlerPer] / throttlerResolution;

                if (lastAddedTimeInPeriod > now) {
                    const positionOfLastElementInPeriod = throttlerResolution - 1;
                    const lastElementInPeriod = eventInState.events[positionOfLastElementInPeriod];

                    // use ! because last element will never be null due to time of block of resolution isn't exhausted
                    eventInState.events[positionOfLastElementInPeriod] = {
                        count: lastElementInPeriod!.count + 1,
                        points: lastElementInPeriod!.points + throttlerPoints,
                    };

                    eventInState = {
                        events: { ...eventInState.events },
                        lastAddedTime: now,
                        lastUpdatedTime: now,
                    };

                    continue;
                }

                if (lastAddedTimeInPeriod < now) {
                    const timeBetweenDates = Math.floor(now - lastAddedTimeInPeriod);
                    const timeInBlockOfResolution = getDateDiff[throttlerPer] / throttlerResolution;

                    const blocksNeedToDelete = Math.floor(timeBetweenDates / timeInBlockOfResolution);

                    if (blocksNeedToDelete <= 0) continue;

                    if (blocksNeedToDelete === 1) {
                        eventInState.events.shift();
                        continue;
                    }

                    if (blocksNeedToDelete > throttlerResolution) {
                        eventInState.events.fill(null);

                        let spliceTo = (blocksNeedToDelete % 1000) % 100;

                        if (spliceTo > throttlerResolution) {
                            if (throttlerResolution >= 10) {
                                spliceTo = spliceTo - throttlerResolution;
                            } else spliceTo = spliceTo % 10;
                        }

                        eventInState.events.splice(0, spliceTo);
                    } else {
                        eventInState.events.splice(0, blocksNeedToDelete);
                    }

                    eventInState.events.push({
                        count: 1,
                        points: throttlerPoints,
                    });

                    const eventsLength = eventInState.events.length;
                    const startAt = eventsLength === 0 ? 1 : eventsLength;

                    eventInState.events.length = throttlerResolution;

                    eventInState.events.fill(null, startAt, throttlerResolution);
                    eventInState = {
                        events: eventInState.events,
                        lastAddedTime: now,
                        lastUpdatedTime: now,
                    };
                    console.log(eventInState.events.length);
                }
            }
        }

        return state;
    },
};

export default Service;
