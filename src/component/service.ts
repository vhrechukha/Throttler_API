import { KindType, PerType, ThrottlerRequest, ThrottlerState, ThrottlerStatePeriod } from '../helpers/runtypes';
import { ResultOfVerification } from '../helpers/interfaces';

import periodDurationsSec from '../helpers/getDateDiff';
import getDateResolution from '../helpers/getDateResolution';
import { longTimePer } from '../helpers/constants';

const Service = {
    async checkPointsSizeWithMaxPoints(points: number, maxPoints: number): Promise<ResultOfVerification> {
        const Allow = points < maxPoints;

        return {
            allow: Allow,
            reason: Allow ? '' : `> ${maxPoints} points`,
        };
    },
    async checkAmountPerSomeTimeOf(
        kind: KindType,
        per: PerType,
        max: number,
        state: ThrottlerState,
        groupName: string
    ): Promise<ResultOfVerification> {
        const groupInState = state[groupName];

        if (!groupInState || !groupInState[per]) {
            return {
                allow: true,
                reason: '',
            };
        }

        const groupInStatePer = groupInState[per] as ThrottlerStatePeriod;
        const groupsInEventInState = groupInStatePer.events;

        const amount = groupsInEventInState.reduce((a: number, event: any) => (event ? a + event[kind] : 0), 0);

        const Allow = max > amount;

        return {
            allow: Allow,
            reason: Allow ? '' : `> ${max} ${kind} per ${per}`,
        };
    },
    checkIfReasonExist(reason: string | undefined): ResultOfVerification {
        return {
            allow: reason ? false : true,
            reason: reason ? reason.concat(reason) : '',
        };
    },
    addEvents(state: ThrottlerState, throttlerRequests: ThrottlerRequest, now: number): ThrottlerState {
        for (const groupName of Object.keys(throttlerRequests)) {
            for (const throttlerForSomePeriod of throttlerRequests[groupName].throttlers) {
                const throttlerPeriod = throttlerForSomePeriod.per || longTimePer;

                const groupThrottlingStateForPeriod = state[groupName]?.[throttlerPeriod]! as ThrottlerStatePeriod;

                const throttlerPoints = throttlerRequests[groupName].points;
                const throttlerResolution =
                    throttlerForSomePeriod.resolution ||
                    groupThrottlingStateForPeriod?.events.length ||
                    getDateResolution[throttlerPeriod];

                if (!groupThrottlingStateForPeriod) {
                    state = this.addInfmAboutPeriodInState(
                        state,
                        groupName,
                        throttlerPeriod,
                        throttlerResolution,
                        throttlerPoints,
                        now
                    );

                    continue;
                }

                const durationOfSegment = periodDurationsSec[throttlerPeriod] / throttlerResolution;
                const lastPossibleTimeToAddToCurrentSegment = groupThrottlingStateForPeriod.lastAddedTime + durationOfSegment;

                const canJustAddToCurrentLastSegment = now < lastPossibleTimeToAddToCurrentSegment;
                if (canJustAddToCurrentLastSegment) {
                    const positionOfLastElementInPeriod = throttlerResolution - 1;
                    const lastElementInPeriod = (groupThrottlingStateForPeriod.events[positionOfLastElementInPeriod] ??= {
                        points: 0,
                        count: 0,
                    });

                    lastElementInPeriod.points += 1;
                    lastElementInPeriod.count += throttlerPoints;

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
                            groupName,
                            throttlerPeriod,
                            throttlerResolution,
                            throttlerPoints,
                            now
                        );
                    } else {
                        groupThrottlingStateForPeriod.events.splice(0, blocksNeedToDelete);
                        groupThrottlingStateForPeriod.events.length = throttlerResolution;

                        groupThrottlingStateForPeriod.events[throttlerResolution - 1] = {
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
        state: ThrottlerState,
        groupName: string,
        throttlerPeriod: PerType,
        throttlerResolution: number,
        points: number,
        now: number
    ): ThrottlerState {
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
};

export default Service;
