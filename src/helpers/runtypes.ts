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

const RT_PerOfThrottler = Union(
    Literal('7d'),
    Literal('1d'),
    Literal('12h'),
    Literal('2h'),
    Literal('1h'),
    Literal('30m'),
    Literal('5m'),
    Literal('1m')
);
type T_PerOfThrottler = Static<typeof RT_PerOfThrottler>;

const RT_KindOfThrottler = Literal('points').Or(Literal('count'));
type T_KindOfThrottler = Static<typeof RT_KindOfThrottler>;

const RT_ThrottlerRequests = Dictionary(
    Record({
        points: Number,
        throttlers: Array(
            Record({
                max: Number,
                kind: RT_KindOfThrottler,
            }).And(
                Partial({
                    per: RT_PerOfThrottler,
                    resolution: Number.withConstraint((n) => n >= 1 && n <= 60),
                })
            )
        ),
    })
);
type T_ThrottlerRequests = Static<typeof RT_ThrottlerRequests>;

const RT_StatePeriod = Record({
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
type T_StatePeriod = Static<typeof RT_StatePeriod>;

const RT_StateEntry = Partial({
    '1000d': RT_StatePeriod,
    '7d': RT_StatePeriod,
    '1d': RT_StatePeriod,
    '12h': RT_StatePeriod,
    '2h': RT_StatePeriod,
    '1h': RT_StatePeriod,
    '30m': RT_StatePeriod,
    '5m': RT_StatePeriod,
    '1m': RT_StatePeriod,
});
type T_StateEntry = Static<typeof RT_StateEntry>;

const RT_State = Dictionary(RT_StateEntry);
type T_State = Static<typeof RT_State>;

export { 
    RT_ThrottlerRequests, 
    T_ThrottlerRequests, 
    T_PerOfThrottler, 
    T_KindOfThrottler, 
    T_State, 
    T_StateEntry, 
    T_StatePeriod 
};
