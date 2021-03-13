"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const getDateDiff_1 = __importDefault(require("../helpers/getDateDiff"));
const references_1 = require("../helpers/references");
let allow = [];
let validationResult = {
    allow: [],
    reason: [],
};
const resultOfEventsVerification = {};
const Service = {
    getResultOfEventsVerification() {
        const result = {
            result: resultOfEventsVerification,
            allow: allow.some(e => e === false) ? false : true,
        };
        allow = [];
        return result;
    },
    writeResultOfThrottler(result) {
        validationResult.allow.push(result.allow);
        if (result.reason !== '')
            validationResult.reason.push(result.reason);
    },
    writeResultOfEvent(eventName) {
        let reasonR = '';
        if (validationResult.reason.length) {
            reasonR = validationResult.reason.join(', ');
            resultOfEventsVerification[eventName] = {
                allow: validationResult.allow,
                reason: reasonR,
            };
            allow.push(false);
        }
        else if (!validationResult.reason.length) {
            resultOfEventsVerification[eventName] = {
                allow: validationResult.allow,
            };
            allow.push(true);
        }
        validationResult = {
            allow: [],
            reason: [],
        };
    },
    addEvents(events, now, state) {
        Object.keys(events).forEach(async (eventName) => {
            const eventEntry = {
                points: events[eventName].points,
                date: now,
            };
            if (!(eventName in state)) {
                state[eventName] = lodash_1.default.cloneDeep(references_1.eventEntryReference);
            }
            this.addEventAndRecalcuateResult(state, eventName, '7d', eventEntry);
            this.addEventAndRecalcuateResult(state, eventName, '1d', eventEntry);
            this.addEventAndRecalcuateResult(state, eventName, '12h', eventEntry);
            this.addEventAndRecalcuateResult(state, eventName, '2h', eventEntry);
            this.addEventAndRecalcuateResult(state, eventName, '1h', eventEntry);
            this.addEventAndRecalcuateResult(state, eventName, '30m', eventEntry);
            this.addEventAndRecalcuateResult(state, eventName, '5m', eventEntry);
            this.addEventAndRecalcuateResult(state, eventName, '1m', eventEntry);
        });
        return state;
    },
    addEventAndRecalcuateResult(state, eventName, time, record) {
        state[eventName][time].events.push(record);
        state[eventName][time].result.count = state[eventName][time].events.length;
        state[eventName][time].result.points = state[eventName][time].events
            .map(event => event.points)
            .reduce((prev, next) => prev + next);
        state[eventName][time].result.lastUpdate = Date.now();
        return state;
    },
    removeInactiveRecordsAndRecalcuateResult(state, time) {
        const timeOfExpire = getDateDiff_1.default[time];
        for (const eventName in state) {
            const dbDate = Date.now() - state[eventName][time].result.lastUpdate;
            if (dbDate > timeOfExpire) {
                const activeRecords = state[eventName][time].events.filter((event) => Date.now() - event.date > timeOfExpire);
                state[eventName][time].events = activeRecords;
                state[eventName][time].result.count = activeRecords.length;
                state[eventName][time].result.points = activeRecords
                    .map(event => event.points)
                    .reduce((prev, next) => prev + next, 0);
                state[eventName][time].result.lastUpdate = Date.now();
            }
        }
        console.log(`checked events on ${time}`);
        return state;
    },
    async checkPointsSizeWithMaxPoints(points, maxPoints) {
        const Allow = points < maxPoints;
        return {
            allow: Allow,
            reason: Allow ? '' : `> ${maxPoints} points`,
        };
    },
    async checkAmountOfPointsOfAllEventsPerSomeTime(eventName, maxPoints, time, now, state) {
        let Allow = true;
        const timeOfExpire = getDateDiff_1.default[time];
        if (eventName in state) {
            const dbDate = now - state[eventName][time].result.lastUpdate;
            if (dbDate > timeOfExpire) {
                this.removeInactiveRecordsAndRecalcuateResult(state, time);
            }
            const totalPoints = state[eventName][time].result.points;
            Allow = totalPoints < maxPoints;
        }
        return {
            allow: Allow,
            reason: Allow ? '' : `> ${maxPoints} points per ${time}`,
        };
    },
    async checkAmountOfAllEventsPerSomeTime(eventName, maxEvent, time, now, state) {
        let Allow = true;
        const timeOfExpire = getDateDiff_1.default[time];
        if (eventName in state) {
            const dbDate = now - state[eventName][time].result.lastUpdate;
            if (dbDate > timeOfExpire) {
                this.removeInactiveRecordsAndRecalcuateResult(state, time);
            }
            const totalPoints = state[eventName][time].result.count;
            Allow = totalPoints < maxEvent;
        }
        return {
            allow: Allow,
            reason: Allow ? '' : `> ${maxEvent} points per ${time}`,
        };
    },
};
exports.default = Service;
//# sourceMappingURL=service.js.map