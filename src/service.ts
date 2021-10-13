import { 
    KindOfThrottler,
    PerOfThrottler,
    ThrottlerRequests,
    State,
} from './helpers/runtypes';
import { ResultOfVerification } from './helpers/interfaces';

import periodDurationsSec from './helpers/getDateDiff';
import getDateResolution from './helpers/getDateResolution';

const addInformAboutPeriodInState = (
    state: State,
    resourceId: string,
    throttlerPeriod: PerOfThrottler,
    throttlerResolution: number,
    points: number,
    now: number
): State => {
    const eventGroupsArray = new Array(throttlerResolution);
    eventGroupsArray[eventGroupsArray.length - 1] = {
        count: 1,
        points,
    };

    state[resourceId] = {
        ...state[resourceId],
        [throttlerPeriod]: {
            events: eventGroupsArray,
            lastAddedTime: now,
            lastUpdatedTime: now,
            count: 1,
            points: points,
        }
    };

    return state;
};

export const checkPointsSizeWithMaxPoints = async (
    points: number, 
    maxPoints: number
): Promise<ResultOfVerification>  => {
        const allow = points < maxPoints;

        return allow ? {
            allow,
        } : {
            allow,
            reason: `> ${maxPoints} points`,
        };
};

export const checkAmountPerSomeTimeOf = async (
    kind: KindOfThrottler,
    per: PerOfThrottler,
    max: number,
    state: State,
    resourceId: string
): Promise<ResultOfVerification> => {
        const amountOfKindResourceEventsInState = state[resourceId]?.[per]?.[kind];

        const allow = !amountOfKindResourceEventsInState || max > amountOfKindResourceEventsInState;

        const result: ResultOfVerification = { allow };
        if (!allow) result.reason = `> ${max} ${kind} per ${per}`;

        return result;
};

export const checkIfReasonExist = (
    newReason?: string, 
    previousReasons?: string
): ResultOfVerification => {
    const previousReasonString = !previousReasons ? `${previousReasons}, ` : '';

    return newReason ? {
        allow: false,
        reason: `${previousReasonString}, ${newReason}`,
    } : {
        allow: true,
        reason: previousReasons,
    };
};

export const addEvents = (
    state: State,
    throttlerRequests: ThrottlerRequests,
    now: number
): State => {
    for (const resourceId of Object.keys(throttlerRequests)) {
        for (const throttlerForSomePeriod of throttlerRequests[resourceId].throttlers) {
            const throttlerPeriod = throttlerForSomePeriod.per;

            if (!throttlerPeriod) continue;

            const resourceThrottlingStateForPeriod = state[resourceId]?.[throttlerPeriod];

            const throttlerPoints = throttlerRequests[resourceId].points;
            const throttlerResolution =
                throttlerForSomePeriod.resolution ||
                resourceThrottlingStateForPeriod?.events.length ||
                getDateResolution[throttlerPeriod];

            if (!resourceThrottlingStateForPeriod) {
                state = addInformAboutPeriodInState(
                    state,
                    resourceId,
                    throttlerPeriod,
                    throttlerResolution,
                    throttlerPoints,
                    now
                );

                continue;
            }

            const durationOfSegment = periodDurationsSec[throttlerPeriod] / throttlerResolution;
            const lastPossibleTimeToAddToCurrentSegment = 
                resourceThrottlingStateForPeriod.lastAddedTime
                + durationOfSegment;

            const addToLastSegment = lastPossibleTimeToAddToCurrentSegment >= now;
            if (addToLastSegment) {
                const positionOfLastElementInPeriod = throttlerResolution - 1;
                const lastElementInPeriod = (resourceThrottlingStateForPeriod.events[positionOfLastElementInPeriod] ??= {
                    points: 0,
                    count: 0,
                });

                lastElementInPeriod.points += throttlerPoints;
                lastElementInPeriod.count += 1;

                resourceThrottlingStateForPeriod.count += 1;
                resourceThrottlingStateForPeriod.points += throttlerPoints;

                continue;
            }

            const needToCreateNewSegments = lastPossibleTimeToAddToCurrentSegment < now;
            if (needToCreateNewSegments) {
                const timeBetweenNowAndLastSegmentFinishTime = Math.floor(now - lastPossibleTimeToAddToCurrentSegment);
                const blocksNeedToDelete = Math.floor(timeBetweenNowAndLastSegmentFinishTime / durationOfSegment);

                if (blocksNeedToDelete <= 0) continue;

                if (blocksNeedToDelete > throttlerResolution) {
                    state = addInformAboutPeriodInState(
                        state,
                        resourceId,
                        throttlerPeriod,
                        throttlerResolution,
                        throttlerPoints,
                        now
                    );
                } else {
                    resourceThrottlingStateForPeriod.events.splice(0, blocksNeedToDelete);

                    for (let i = 0; i <= resourceThrottlingStateForPeriod.events.length; i++) {
                        resourceThrottlingStateForPeriod.count 
                            += resourceThrottlingStateForPeriod.events[i]?.count!;

                        resourceThrottlingStateForPeriod.points 
                            += resourceThrottlingStateForPeriod.events[i]?.points!;
                    }        
                    resourceThrottlingStateForPeriod.events.length = throttlerResolution;

                    resourceThrottlingStateForPeriod.events[throttlerResolution - 1] = {
                        count: 1,
                        points: throttlerPoints,
                    };
                }
            }
        }
    }
    
    return state;
};

export const clearOldData = (state: State, now: number): void => {
    for (const resourceId of Object.keys(state)) {
        for (const [throttlerPeriod, groupThrottlingState] of Object.entries(state[resourceId])) {
            
            const throttlerResolution = groupThrottlingState.events.length;
            const durationOfSegment = periodDurationsSec[throttlerPeriod] / throttlerResolution;
            const lastPossibleTimeToAddToCurrentSegment = groupThrottlingState.lastAddedTime + durationOfSegment;

            const needToCreateNewSegments = lastPossibleTimeToAddToCurrentSegment < now;
            if (needToCreateNewSegments) {
                const timeBetweenNowAndLastSegmentFinishTime = Math.floor(now - lastPossibleTimeToAddToCurrentSegment);
                const blocksNeedToDelete = Math.floor(timeBetweenNowAndLastSegmentFinishTime / durationOfSegment);

                if (blocksNeedToDelete <= 0) continue;

                if (blocksNeedToDelete > throttlerResolution) {
                    if (Object.keys(groupThrottlingState).length <= 1) {
                        delete state[resourceId];

                        continue;
                    }
                } else {
                    groupThrottlingState.events.splice(0, blocksNeedToDelete);
                    groupThrottlingState.events.length = throttlerResolution;
                }
            }
            
        }
    }
};
