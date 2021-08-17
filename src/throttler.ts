import service from './service';

import { T_ThrottlerRequests, T_State } from './helpers/runtypes';

import { ResultOfResourceVerifications, ResponseOfResultOfGroupVerification } from './helpers/interfaces';

export default async function throttle(
    throttlerRequests: T_ThrottlerRequests,
    state: T_State,
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

            const resultOfResourceId = resultOfResourceIdVerifications[groupName];

            if (throttler.per) {
                const result = await service.checkAmountPerSomeTimeOf(
                    throttler.kind,
                    throttler.per,
                    throttler.max,
                    state,
                    groupName
                );

                const { reason, allow } = service.checkIfReasonExist(result.reason, resultOfResourceId.reason);
                
                resultOfResourceId.allow.push(result.allow);
                resultOfResourceId.reason = reason;

                isAllowToPushInState = allow;
            } else {
                const result = await service.checkPointsSizeWithMaxPoints(points, throttler.max);
                
                const { reason, allow } = service.checkIfReasonExist(result.reason, resultOfResourceId.reason);

                resultOfResourceId.allow.push(result.allow);
                resultOfResourceId.reason = reason;
                
                isAllowToPushInState = allow;
            }
        }

        if (!resultOfResourceIdVerifications[groupName].reason) delete resultOfResourceIdVerifications[groupName].reason;
    }

    await isAllowToPushInState && service.addEvents(state, throttlerRequests, now);

    return {
        allow: isAllowToPushInState,
        data: resultOfResourceIdVerifications,
    };
}
