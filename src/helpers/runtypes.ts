import { Record, Number, Dictionary, Union, Array, Literal, Partial, Static, Null, Tuple } from 'runtypes';

export const PerRunType = Union(
    Literal('7d'),
    Literal('1d'),
    Literal('12h'),
    Literal('2h'),
    Literal('1h'),
    Literal('30m'),
    Literal('5m'),
    Literal('1m')
);

export const PerValues = [...PerRunType.alternatives.values()].map(x => x.value);

export type PerType = Static<typeof PerRunType>;

const ThrottlerRequest = Dictionary(
    Record({
        points: Number,
        throttlers: Array(
            Record({
                max: Number,
                kind: Literal('points').Or(Literal('count')),
            }).And(
                Partial({
                    per: PerRunType,
                    resolution: Number.withConstraint(n => n >= 1 && n <= 60),
                })
            )
        ),
    })
);

type ThrottlerRequest = Static<typeof ThrottlerRequest>;

const ThrottlerStatePeriod = Record({
    events: Array(
        Record({
            count: Number,
            points: Number,
        }).Or(Null)
    ),
    lastAddedTime: Number,
    lastUpdatedTime: Number,
});

type ThrottlerStatePeriod = Static<typeof ThrottlerStatePeriod>;

const ThrottlerStateEntry = Partial({
    '1000d': ThrottlerStatePeriod,
    '7d': ThrottlerStatePeriod,
    '1d': ThrottlerStatePeriod,
    '12h': ThrottlerStatePeriod,
    '2h': ThrottlerStatePeriod,
    '1h': ThrottlerStatePeriod,
    '30m': ThrottlerStatePeriod,
    '5m': ThrottlerStatePeriod,
    '1m': ThrottlerStatePeriod,
});
const ThrottlerStateRuntype = Dictionary(ThrottlerStateEntry);

type ThrottlerState = Static<typeof ThrottlerStateRuntype>;
type ThrottlerStateEntry = Static<typeof ThrottlerStateEntry>;

export const defaultPerValues: { [period in keyof ThrottlerStateEntry]: number } = {
    '1000d': 1,
    '7d': 1,
    '1d': 1,
    '12h': 1,
    '2h': 1,
    '1h': 2,
    '30m': 3,
    '5m': 4,
    '1m': 5,
};

export { ThrottlerRequest, ThrottlerState, ThrottlerStateEntry, ThrottlerStatePeriod };
