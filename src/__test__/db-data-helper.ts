import _ from 'lodash';
import colors from 'colors';
import * as faker from 'faker';
import { performance } from 'perf_hooks';

import { EventEntry } from '../helpers/runtypes';
import { eventEntryReference } from '../helpers/references';
import { time } from 'console';

const state: EventEntry = {};
const dates: ('7d' | '1d' | '12h' | '2h' | '1h' | '30m' | '5m' | '1m')[] = ['7d', '1d', '12h', '2h', '1h', '30m', '5m', '1m'];

const dbDataHelper = {
    getStateWithNotRepeatedEvents(): EventEntry {
        const t0 = performance.now();
        for (let i = 0; i <= 500; i++) {
            const eventName = faker.internet.url();
            for (const date of dates) {
                for (let i = 0; i <= 60; i++) {
                    const eventEntry = {
                        date: faker.date.past().getTime(),
                        points: faker.random.number(),
                    };

                    state[eventName] = _.cloneDeep(eventEntryReference);
                    state[eventName][date].events.push(eventEntry);
                }
                state[eventName][date].result.count = state[eventName][date].events.length;
                state[eventName][date].result.points = state[eventName][date].events
                    .map(event => event.points)
                    .reduce((prev, next) => prev + next, 0);
            }
        }

        const t1 = performance.now();
        console.log(`Create of 500 recording in state took ${t1 - t0} milliseconds.`);

        return state;
    },
    getStateWithRepeatedEvents(): EventEntry {
        const t0 = performance.now();

        state['pastebin.com/prod/users/kotichka'] = _.cloneDeep(eventEntryReference);
        state['pastebin.com/prod/categories/free-cats'] = _.cloneDeep(eventEntryReference);

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
            state['pastebin.com/prod/categories/free-cats'][date].result.points = state['pastebin.com/prod/categories/free-cats'][
                date
            ].events
                .map(event => event.points)
                .reduce((prev, next) => prev + next);
            state['pastebin.com/prod/categories/free-cats'][date].result.lastUpdate = Date.now();
        }

        const t1 = performance.now();
        console.log(`Add two events for test took ${t1 - t0} milliseconds.`);

        return state;
    },
};

export default dbDataHelper;
