import { 
    T_KindOfThrottler,
    T_PerOfThrottler, 
    T_ThrottlerRequests, 
    T_State, 
    T_StatePeriod
} from './helpers/runtypes';
import { ResultOfVerification } from './helpers/interfaces';

import periodDurationsSec from './helpers/getDateDiff';
import getDateResolution from './helpers/getDateResolution';
import { longTimePer } from './helpers/constants';

const Service = {
    async checkPointsSizeWithMaxPoints(points: number, maxPoints: number): Promise<ResultOfVerification> {
        const allow = points < maxPoints;

        return allow ? {
            allow,
        } : {
            allow,
            reason: `> ${maxPoints} points`,
        };
    },
    async checkAmountPerSomeTimeOf(
        kind: T_KindOfThrottler,
        per: T_PerOfThrottler,
        max: number,
        state: T_State,
        resourceId: string
    ): Promise<ResultOfVerification> {
        const resourceIdInState = state[resourceId];

        if (!resourceIdInState || !resourceIdInState[per]) {
            return {
                allow: true,
                reason: '',
            };
        }

        const groupInStatePer = resourceIdInState[per] as T_StatePeriod;
        const groupsInEventInState = groupInStatePer.events;

        const amount = groupsInEventInState.reduce((a: number, event: any) => (event ? a + event[kind] : 0), 0);

        const allow = max > amount;

        return allow ? { 
            allow 
        } : {
            allow,
            reason: `> ${max} ${kind} per ${per}`,
        };
    },
    checkIfReasonExist(newReason: string | undefined, previousReasons: string | undefined): ResultOfVerification {
        const previousReasonString = previousReasons ? `${previousReasons}, ` : '';

        return {
            allow: newReason ? false : true,
            reason: newReason ? `${previousReasonString}${newReason}` : previousReasons,
        };
    },
    addEvents(state: T_State, throttlerRequests: T_ThrottlerRequests, now: number): T_State {
        for (const resourceId of Object.keys(throttlerRequests)) {
            for (const throttlerForSomePeriod of throttlerRequests[resourceId].throttlers) {
                const throttlerPeriod = throttlerForSomePeriod.per || longTimePer;

                const resourceIdThrottlingStateForPeriod = state[resourceId]?.[throttlerPeriod];

                const throttlerPoints = throttlerRequests[resourceId].points;
                const throttlerResolution =
                    throttlerForSomePeriod.resolution ||
                    resourceIdThrottlingStateForPeriod?.events.length ||
                    getDateResolution[throttlerPeriod];

                if (!resourceIdThrottlingStateForPeriod) {
                    state = this.addInfmAboutPeriodInState(
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
                    resourceIdThrottlingStateForPeriod.lastAddedTime
                    + durationOfSegment;

                const canJustAddToCurrentLastSegment = now < lastPossibleTimeToAddToCurrentSegment;
                if (canJustAddToCurrentLastSegment) {
                    const positionOfLastElementInPeriod = throttlerResolution - 1;
                    const lastElementInPeriod = (resourceIdThrottlingStateForPeriod.events[positionOfLastElementInPeriod] ??= {
                        points: 0,
                        count: 0,
                    });

                    lastElementInPeriod.points += throttlerPoints;
                    lastElementInPeriod.count += 1;

                    continue;
                }

                const needToCreateNewSegments = lastPossibleTimeToAddToCurrentSegment < now;
                if (needToCreateNewSegments) {
                    const timeBetweenNowAndLastSegmentFinishTime = Math.floor(now - lastPossibleTimeToAddToCurrentSegment);
                    const blocksNeedToDelete = Math.floor(timeBetweenNowAndLastSegmentFinishTime / durationOfSegment);

                    if (blocksNeedToDelete <= 0) continue;

                    if (blocksNeedToDelete > throttlerResolution) {
                        state = this.addInfmAboutPeriodInState(
                            state,
                            resourceId,
                            throttlerPeriod,
                            throttlerResolution,
                            throttlerPoints,
                            now
                        );
                    } else {
                        resourceIdThrottlingStateForPeriod.events.splice(0, blocksNeedToDelete);
                        resourceIdThrottlingStateForPeriod.events.length = throttlerResolution;

                        resourceIdThrottlingStateForPeriod.events[throttlerResolution - 1] = {
                            count: 1,
                            points: throttlerPoints,
                        };
                    }
                }
            }
        }

        return state;
    },
    addInfmAboutPeriodInState(
        state: T_State,
        groupName: string,
        throttlerPeriod: T_PerOfThrottler,
        throttlerResolution: number,
        points: number,
        now: number
    ): T_State {
        const eventGroupsArray = new Array(throttlerResolution);
        eventGroupsArray[eventGroupsArray.length - 1] = {
            count: 1,
            points,
        };

        if (!state[groupName]) {
            state[groupName] = {};
        }
        state[groupName][throttlerPeriod] = {
            events: eventGroupsArray,
            lastAddedTime: now,
            lastUpdatedTime: now,
        };

        return state;
    },
    clearOldData(state: T_State, now: number): void {
        for (const groupName of Object.keys(state)) {
            for (const [periodName, groupThrottlingState] of Object.entries(state[groupName])) {
                
                const throttlerResolution = groupThrottlingState.events.length;
                const durationOfSegment = periodDurationsSec[periodName] / throttlerResolution;
                const lastPossibleTimeToAddToCurrentSegment = groupThrottlingState.lastAddedTime + durationOfSegment;

                const needToCreateNewSegments = lastPossibleTimeToAddToCurrentSegment < now;
                if (needToCreateNewSegments) {
                    const timeBetweenNowAndLastSegmentFinishTime = Math.floor(now - lastPossibleTimeToAddToCurrentSegment);
                    const blocksNeedToDelete = Math.floor(timeBetweenNowAndLastSegmentFinishTime / durationOfSegment);

                    if (blocksNeedToDelete <= 0) continue;

                    if (blocksNeedToDelete > throttlerResolution) {
                        if (Object.keys(groupThrottlingState).length <= 1) {
                            delete state[groupName];

                            continue;
                        }
                    } else {
                        groupThrottlingState.events.splice(0, blocksNeedToDelete);
                        groupThrottlingState.events.length = throttlerResolution;
                    }
                }
                
            }
        }
    },
};

export default Service;
