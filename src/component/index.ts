import service from './service';

import { ThrottlerRequest, ThrottlerState } from '../helpers/runtypes';
import { ResultOfGroupVerifications, ResponseOfResultOfGroupVerification } from '../helpers/interfaces';

export async function throttling(
    throttlerRequests: ThrottlerRequest,
    state: ThrottlerState,
    now: number
): Promise<ResponseOfResultOfGroupVerification> {
    let isAllowToPushGroupsInState = true;
    const resultOfGroupVerifications: ResultOfGroupVerifications = {};

    for (const groupName of Object.keys(throttlerRequests)) {
        resultOfGroupVerifications[groupName] = {
            allow: [],
            reason: '',
        };

        for (const throttlerRequest of throttlerRequests[groupName].throttlers) {
            const { points }: { points: number } = throttlerRequests[groupName];
            const resultOfGroup = resultOfGroupVerifications[groupName];

            if (throttlerRequest.per) {
                const result = await service.checkAmountPerSomeTimeOf(
                    throttlerRequest.kind,
                    throttlerRequest.per,
                    throttlerRequest.max,
                    state,
                    groupName
                );

                resultOfGroup.allow.push(result.allow);

                const { reason, allow } = service.checkIfReasonExist(resultOfGroup.reason);
                resultOfGroup.reason = reason;

                isAllowToPushGroupsInState = allow;
            } else {
                const result = await service.checkPointsSizeWithMaxPoints(points, throttlerRequest.max);

                resultOfGroup.allow.push(result.allow);

                const { reason, allow } = service.checkIfReasonExist(resultOfGroup.reason);
                resultOfGroup.reason = reason;

                isAllowToPushGroupsInState = allow;
            }
        }

        if (!resultOfGroupVerifications[groupName].reason) delete resultOfGroupVerifications[groupName].reason;
    }

    return {
        allow: isAllowToPushGroupsInState,
        data: resultOfGroupVerifications,
        state: isAllowToPushGroupsInState ? service.addEvents(state, throttlerRequests, now) : null,
    };
}
