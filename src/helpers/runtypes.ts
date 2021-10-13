import { 
    Record, 
    Number, 
    Dictionary, 
    Union, 
    Array, 
    Literal, 
    Partial, 
    Static, 
    Undefined
} from 'runtypes';

const RTPerOfThrottler = Union(
    Literal('7d'),
    Literal('1d'),
    Literal('12h'),
    Literal('2h'),
    Literal('1h'),
    Literal('30m'),
    Literal('5m'),
    Literal('1m')
);
type PerOfThrottler = Static<typeof RTPerOfThrottler>;

const RTKindOfThrottler = Literal('points').Or(Literal('count'));
type KindOfThrottler = Static<typeof RTKindOfThrottler>;

const RTThrottlerRequests = Dictionary(
    Record({
        points: Number,
        throttlers: Array(
            Record({
                max: Number,
                kind: RTKindOfThrottler,
            }).And(
                Partial({
                    per: RTPerOfThrottler,
                    resolution: Number.withConstraint((n) => n >= 1 && n <= 60),
                })
            )
        ),
    })
);
type ThrottlerRequests = Static<typeof RTThrottlerRequests>;

const RTStatePeriod = Record({
    events: Array(
        Record({
            count: Number,
            points: Number,
        }).Or(Undefined)
    ),
    points: Number,
    count: Number,
    lastAddedTime: Number,
    lastUpdatedTime: Number,
});
type StatePeriod = Static<typeof RTStatePeriod>;

const RTStateEntry = Partial({
    '1000d': RTStatePeriod,
    '7d': RTStatePeriod,
    '1d': RTStatePeriod,
    '12h': RTStatePeriod,
    '2h': RTStatePeriod,
    '1h': RTStatePeriod,
    '30m': RTStatePeriod,
    '5m': RTStatePeriod,
    '1m': RTStatePeriod,
});
type StateEntry = Static<typeof RTStateEntry>;

const RTState = Dictionary(RTStateEntry);
type State = Static<typeof RTState>;

export { 
    RTThrottlerRequests,
    ThrottlerRequests,
    PerOfThrottler,
    KindOfThrottler,
    State,
    StateEntry,
    StatePeriod
};
