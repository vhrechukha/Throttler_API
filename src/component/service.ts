import { PerType, ThrottlerRequest, ThrottlerState } from '../helpers/runtypes';
import { ResultOfVerification } from '../helpers/interfaces';

import getDateDiff from '../helpers/getDateDiff';
import getDateResolution from '../helpers/getDateResolution';
import { eventEntryReference } from '../helpers/references';

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
                const { points }: { points: number } = events[eventName];
                const throttlerPer = throttler.per;

                if (throttlerPer) {
                    const throttlerResolution = throttler.resolution || getDateResolution[throttlerPer];
                    if (!state[eventName] || !state[eventName][throttlerPer]) {
                        const array = new Array(throttlerResolution - 1).fill(null);

                        state[eventName] = {
                            [throttlerPer]: {
                                events: [
                                    ...array,
                                    {
                                        count: 1,
                                        points,
                                    },
                                ],
                                timestamp: now,
                                timeshift: now,
                            },
                        };

                        break;
                    }

                    let eventInState = state[eventName][throttlerPer]!;

                    if (
                        !eventInState.events ||
                        !eventInState.timeshift ||
                        !eventInState.timestamp ||
                        eventInState.events.length !== throttlerResolution
                    ) {
                        const array = new Array(throttlerResolution - 1).fill(null);

                        state[eventName][throttlerPer] = {
                            events: [
                                ...array,
                                {
                                    count: 1,
                                    points,
                                },
                            ],
                            timestamp: now,
                            timeshift: now,
                        };
                        break;
                    }

                    const throttlerResolutionDefault = eventInState.events.length;
                    const timestamp = eventInState.timestamp + getDateDiff[throttlerPer] / throttlerResolutionDefault;

                    if (timestamp > now) {
                        const lastBlockInEvents = eventInState.events[throttlerResolutionDefault - 1];

                        if (!lastBlockInEvents) {
                            eventInState.events[throttlerResolutionDefault - 1] = {
                                count: 1,
                                points: points,
                            };
                            eventInState = {
                                events: { ...eventInState.events },
                                timestamp: now,
                                timeshift: now,
                            };
                        } else {
                            eventInState.events[throttlerResolutionDefault - 1] = {
                                count: lastBlockInEvents.count + 1,
                                points: lastBlockInEvents.points + points,
                            };

                            eventInState = {
                                events: { ...eventInState.events },
                                timestamp: now,
                                timeshift: now,
                            };
                        }

                        break;
                    }

                    if (timestamp < now) {
                        const timeBetweenDates = Math.floor(now - timestamp);
                        const timeInBlock = getDateDiff[throttlerPer] / throttlerResolutionDefault;

                        const blocksNeedToDelete = Math.floor(timeBetweenDates / timeInBlock);

                        if (blocksNeedToDelete <= 0) break;

                        if (blocksNeedToDelete === 1) eventInState.events.shift();
                        else {
                            if (blocksNeedToDelete > throttlerResolutionDefault) {
                                eventInState.events.fill(null);

                                let spliceTo = (blocksNeedToDelete % 1000) % 100;

                                if (spliceTo > throttlerResolutionDefault) {
                                    if (throttlerResolutionDefault >= 10) {
                                        spliceTo = spliceTo - throttlerResolutionDefault;
                                    } else spliceTo = spliceTo % 10;
                                }

                                eventInState.events.splice(0, spliceTo);
                            } else {
                                eventInState.events.splice(0, blocksNeedToDelete);
                            }
                        }

                        eventInState.events.push({
                            count: 1,
                            points: points,
                        });

                        const eventsLength = eventInState.events.length;
                        const startAt = eventsLength === 0 ? 0 : eventsLength;

                        eventInState.events.length = throttlerResolutionDefault;

                        eventInState.events.fill(null, startAt, throttlerResolutionDefault);

                        eventInState = {
                            events: eventInState.events,
                            timestamp: now,
                            timeshift: now,
                        };

                        break;
                    }
                }
            }
        }

        return state;
    },
};

export default Service;
