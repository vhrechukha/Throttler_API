"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = exports.EventEntry = exports.Throtthler = void 0;
const runtypes_1 = require("runtypes");
const Throtthler = runtypes_1.Dictionary(runtypes_1.Record({
    points: runtypes_1.Number,
    throttlers: runtypes_1.Array(runtypes_1.Record({
        max: runtypes_1.Number,
        kind: runtypes_1.Literal('points').Or(runtypes_1.Literal('count')),
    }).And(runtypes_1.Partial({
        per: runtypes_1.Literal('7d')
            .Or(runtypes_1.Literal('1d'))
            .Or(runtypes_1.Literal('12h'))
            .Or(runtypes_1.Literal('2h'))
            .Or(runtypes_1.Literal('1h'))
            .Or(runtypes_1.Literal('30m'))
            .Or(runtypes_1.Literal('5m'))
            .Or(runtypes_1.Literal('1m')),
    }))),
}));
exports.Throtthler = Throtthler;
const Event = runtypes_1.Record({
    events: runtypes_1.Array(runtypes_1.Record({
        date: runtypes_1.Number,
        points: runtypes_1.Number,
    })),
    result: runtypes_1.Record({
        lastUpdate: runtypes_1.Number,
        points: runtypes_1.Number,
        count: runtypes_1.Number,
    }),
});
exports.Event = Event;
const EventEntry = runtypes_1.Dictionary(runtypes_1.Record({
    '7d': Event,
    '1d': Event,
    '12h': Event,
    '2h': Event,
    '1h': Event,
    '30m': Event,
    '5m': Event,
    '1m': Event,
}));
exports.EventEntry = EventEntry;
//# sourceMappingURL=runtypes.js.map