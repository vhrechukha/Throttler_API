"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.throttler = void 0;
const service_1 = __importDefault(require("./service"));
async function throttler(events, state, now) {
    const result = {
        resultOfTotalPointsSize: { allow: false, reason: '' },
        resultOfPoints: { allow: false, reason: '' },
        resultOfSumEvents: { allow: false, reason: '' },
    };
    for (const eventName of Object.keys(events)) {
        for (const throttler of events[eventName].throttlers) {
            const { points } = events[eventName];
            if (throttler.kind === 'points') {
                if (throttler.per !== undefined) {
                    result.resultOfTotalPointsSize = await service_1.default.checkAmountOfPointsOfAllEventsPerSomeTime(eventName, throttler.max, throttler.per, now, state);
                    service_1.default.writeResultOfThrottler(result.resultOfTotalPointsSize);
                }
                else if (throttler.per === undefined) {
                    result.resultOfPoints = await service_1.default.checkPointsSizeWithMaxPoints(points, throttler.max);
                    service_1.default.writeResultOfThrottler(result.resultOfPoints);
                }
            }
            if (throttler.kind === 'count') {
                if (throttler.per !== undefined) {
                    result.resultOfSumEvents = await service_1.default.checkAmountOfAllEventsPerSomeTime(eventName, throttler.max, throttler.per, now, state);
                    service_1.default.writeResultOfThrottler(result.resultOfSumEvents);
                }
            }
        }
        service_1.default.writeResultOfEvent(eventName);
    }
    const resultOfVerificationEvents = service_1.default.getResultOfEventsVerification();
    if (resultOfVerificationEvents.allow) {
        return {
            allow: resultOfVerificationEvents.allow,
            data: resultOfVerificationEvents.result,
            newState: service_1.default.addEvents(events, now, state),
        };
    }
    return {
        allow: resultOfVerificationEvents.allow,
        data: resultOfVerificationEvents.result,
        newState: null,
    };
}
exports.throttler = throttler;
//# sourceMappingURL=index.js.map