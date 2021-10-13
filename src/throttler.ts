import * as service from './service';

import { ThrottlerRequests, State } from './helpers/runtypes';

import { ResultOfResourceVerifications, ResponseOfResultOfGroupVerification } from './helpers/interfaces';

export default async function throttle(
    throttlerRequests: ThrottlerRequests,
    state: State,
    now: number
): Promise<ResponseOfResultOfGroupVerification> {
    let isAllowToPushInState = true;
    const resultOfResourceIdVerifications: ResultOfResourceVerifications = {};

    for (const groupName of Object.keys(throttlerRequests)) {
        resultOfResourceIdVerifications[groupName] = {
            allow: [],
            reason: '',
        };

        for (const throttler of throttlerRequests[groupName].throttlers) {
            const points = throttlerRequests[groupName].points;

            if (throttler.per) {
                const result = await service.checkAmountPerSomeTimeOf(
                    throttler.kind,
                    throttler.per,
                    throttler.max,
                    state,
                    groupName
                );

                const { reason, allow } = service.checkIfReasonExist(
                    result.reason, 
                    resultOfResourceIdVerifications[groupName].reason
                    );

                resultOfResourceIdVerifications[groupName].allow.push(result.allow);
                resultOfResourceIdVerifications[groupName].reason = reason;

                if (isAllowToPushInState) isAllowToPushInState = allow;
            } else {
                const result = await service.checkPointsSizeWithMaxPoints(points, throttler.max);
                
                const { reason, allow } = service.checkIfReasonExist(
                    result.reason, 
                    resultOfResourceIdVerifications[groupName].reason
                    );

                resultOfResourceIdVerifications[groupName].allow.push(result.allow);
                resultOfResourceIdVerifications[groupName].reason = reason;
                
                if (isAllowToPushInState) isAllowToPushInState = allow;
            }
        }

        if (!resultOfResourceIdVerifications[groupName].reason) delete resultOfResourceIdVerifications[groupName].reason;
    }

    if (isAllowToPushInState) service.addEvents(state, throttlerRequests, now);

    return {
        allow: isAllowToPushInState,
        data: resultOfResourceIdVerifications,
    };
}
