import { Record, Number, Dictionary, Array, Literal, Partial, Static } from 'runtypes';

const Throtthler = Dictionary(
    Record({
        points: Number,
        throttlers: Array(
            Record({
                max: Number,
                kind: Literal('points').Or(Literal('count')),
            }).And(
                Partial({
                    per: Literal('7d')
                        .Or(Literal('1d'))
                        .Or(Literal('12h'))
                        .Or(Literal('2h'))
                        .Or(Literal('1h'))
                        .Or(Literal('30m'))
                        .Or(Literal('5m'))
                        .Or(Literal('1m')),
                })
            )
        ),
    })
);

type Throtthler = Static<typeof Throtthler>;

const Event = Record({
    events: Array(
        Record({
            date: Number,
            points: Number,
        })
    ),
    result: Record({
        lastUpdate: Number,
        points: Number,
        count: Number,
    }),
});

type Event = Static<typeof Event>;

const EventEntry = Dictionary(
    Record({
        '7d': Event,
        '1d': Event,
        '12h': Event,
        '2h': Event,
        '1h': Event,
        '30m': Event,
        '5m': Event,
        '1m': Event,
    })
);
type EventEntry = Static<typeof EventEntry>;

export { Throtthler, EventEntry, Event };
