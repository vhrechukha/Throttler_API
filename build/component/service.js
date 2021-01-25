"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getDateDiff_1 = __importDefault(require("../helpers/getDateDiff"));
let allow = true;
let validationResult = {
    allow: [],
    reason: [],
};
const resultOfEventsVerification = {};
const Service = {
    getResultOfEventsVerification() {
        return {
            result: resultOfEventsVerification,
            allow,
        };
    },
    writeResult(result) {
        validationResult.allow.push(result.allow);
        if (result.reason !== '')
            validationResult.reason.push(result.reason);
    },
    writeResultOfEvent(event) {
        let reasonR = '';
        if (validationResult.reason.length) {
            reasonR = validationResult.reason.join(', ');
            resultOfEventsVerification[event] = {
                allow: validationResult.allow,
                reason: reasonR,
            };
            allow = false;
        }
        else if (!validationResult.reason.length) {
            resultOfEventsVerification[event] = {
                allow: validationResult.allow,
            };
            allow = true;
        }
        validationResult = {
            allow: [],
            reason: [],
        };
    },
    addEvents(data, now, state) {
        Object.keys(data).forEach(event => {
            state.push({
                event,
                points: now - data[event].points,
                date: now - 7 * 24 * 60 * 60 * 1000,
            });
        });
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
        const date = now - getDateDiff_1.default[time];
        const totalPoints = state
            .filter(e => e.event === eventName && e.date >= date)
            .reduce((total, e) => total + e.points, 0);
        const Allow = totalPoints === undefined || totalPoints < maxPoints;
        return {
            allow: Allow,
            reason: Allow ? '' : `> ${maxPoints} points per ${time}`,
        };
    },
    async checkAmountOfAllEventsPerSomeTime(eventName, maxEvent, time, now, state) {
        const date = now - getDateDiff_1.default[time];
        const totalPoints = state.filter(e => e.event === eventName && e.date >= date);
        const Allow = totalPoints === undefined || totalPoints.length < maxEvent;
        return {
            allow: Allow,
            reason: Allow ? '' : `> ${maxEvent} points per ${time}`,
        };
    },
};
exports.default = Service;
//# sourceMappingURL=service.js.map