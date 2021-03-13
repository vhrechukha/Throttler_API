"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const faker = __importStar(require("faker"));
const perf_hooks_1 = require("perf_hooks");
const references_1 = require("../helpers/references");
const state = {};
const dates = ['7d', '1d', '12h', '2h', '1h', '30m', '5m', '1m'];
const dbDataHelper = {
    getStateWithNotRepeatedEvents() {
        const t0 = perf_hooks_1.performance.now();
        for (let i = 0; i <= 500; i++) {
            const eventName = faker.internet.url();
            for (const date of dates) {
                for (let i = 0; i <= 60; i++) {
                    const eventEntry = {
                        date: faker.date.past().getTime(),
                        points: faker.random.number(),
                    };
                    state[eventName] = lodash_1.default.cloneDeep(references_1.eventEntryReference);
                    state[eventName][date].events.push(eventEntry);
                }
                state[eventName][date].result.count = state[eventName][date].events.length;
                state[eventName][date].result.points = state[eventName][date].events
                    .map(event => event.points)
                    .reduce((prev, next) => prev + next, 0);
            }
        }
        const t1 = perf_hooks_1.performance.now();
        console.log(`Create of 500 recording in state took ${t1 - t0} milliseconds.`);
        return state;
    },
    getStateWithRepeatedEvents() {
        const t0 = perf_hooks_1.performance.now();
        state['pastebin.com/prod/users/kotichka'] = lodash_1.default.cloneDeep(references_1.eventEntryReference);
        state['pastebin.com/prod/categories/free-cats'] = lodash_1.default.cloneDeep(references_1.eventEntryReference);
        for (const date of dates) {
            for (let i = 0; i <= 20; i++) {
                const eventEntry = {
                    date: Date.now(),
                    points: 10000,
                };
                state['pastebin.com/prod/users/kotichka'][date].events.push(eventEntry);
                state['pastebin.com/prod/categories/free-cats'][date].events.push(eventEntry);
            }
            state['pastebin.com/prod/users/kotichka'][date].result.count =
                state['pastebin.com/prod/users/kotichka'][date].events.length;
            state['pastebin.com/prod/users/kotichka'][date].result.points = state['pastebin.com/prod/users/kotichka'][date].events
                .map(event => event.points)
                .reduce((prev, next) => prev + next);
            state['pastebin.com/prod/users/kotichka'][date].result.lastUpdate = Date.now();
            state['pastebin.com/prod/categories/free-cats'][date].result.count =
                state['pastebin.com/prod/categories/free-cats'][date].events.length;
            state['pastebin.com/prod/categories/free-cats'][date].result.points = state['pastebin.com/prod/categories/free-cats'][date].events
                .map(event => event.points)
                .reduce((prev, next) => prev + next);
            state['pastebin.com/prod/categories/free-cats'][date].result.lastUpdate = Date.now();
        }
        const t1 = perf_hooks_1.performance.now();
        console.log(`Add two events for test took ${t1 - t0} milliseconds.`);
        return state;
    },
};
exports.default = dbDataHelper;
//# sourceMappingURL=db-data-helper.js.map