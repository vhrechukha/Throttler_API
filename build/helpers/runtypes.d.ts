import { Record, Number, Array, Literal, Partial, Static } from 'runtypes';
declare const Throtthler: import("runtypes").StringDictionary<Record<{
    points: Number;
    throttlers: Array<import("runtypes").Intersect2<Record<{
        max: Number;
        kind: import("runtypes").Union2<Literal<"points">, Literal<"count">>;
    }, false>, Partial<{
        per: import("runtypes").Union2<import("runtypes").Union2<import("runtypes").Union2<import("runtypes").Union2<import("runtypes").Union2<import("runtypes").Union2<import("runtypes").Union2<Literal<"7d">, Literal<"1d">>, Literal<"12h">>, Literal<"2h">>, Literal<"1h">>, Literal<"30m">>, Literal<"5m">>, Literal<"1m">>;
    }, false>>, false>;
}, false>>;
declare type Throtthler = Static<typeof Throtthler>;
declare const Event: Record<{
    events: Array<Record<{
        date: Number;
        points: Number;
    }, false>, false>;
    result: Record<{
        lastUpdate: Number;
        points: Number;
        count: Number;
    }, false>;
}, false>;
declare type Event = Static<typeof Event>;
declare const EventEntry: import("runtypes").StringDictionary<Record<{
    '7d': Record<{
        events: Array<Record<{
            date: Number;
            points: Number;
        }, false>, false>;
        result: Record<{
            lastUpdate: Number;
            points: Number;
            count: Number;
        }, false>;
    }, false>;
    '1d': Record<{
        events: Array<Record<{
            date: Number;
            points: Number;
        }, false>, false>;
        result: Record<{
            lastUpdate: Number;
            points: Number;
            count: Number;
        }, false>;
    }, false>;
    '12h': Record<{
        events: Array<Record<{
            date: Number;
            points: Number;
        }, false>, false>;
        result: Record<{
            lastUpdate: Number;
            points: Number;
            count: Number;
        }, false>;
    }, false>;
    '2h': Record<{
        events: Array<Record<{
            date: Number;
            points: Number;
        }, false>, false>;
        result: Record<{
            lastUpdate: Number;
            points: Number;
            count: Number;
        }, false>;
    }, false>;
    '1h': Record<{
        events: Array<Record<{
            date: Number;
            points: Number;
        }, false>, false>;
        result: Record<{
            lastUpdate: Number;
            points: Number;
            count: Number;
        }, false>;
    }, false>;
    '30m': Record<{
        events: Array<Record<{
            date: Number;
            points: Number;
        }, false>, false>;
        result: Record<{
            lastUpdate: Number;
            points: Number;
            count: Number;
        }, false>;
    }, false>;
    '5m': Record<{
        events: Array<Record<{
            date: Number;
            points: Number;
        }, false>, false>;
        result: Record<{
            lastUpdate: Number;
            points: Number;
            count: Number;
        }, false>;
    }, false>;
    '1m': Record<{
        events: Array<Record<{
            date: Number;
            points: Number;
        }, false>, false>;
        result: Record<{
            lastUpdate: Number;
            points: Number;
            count: Number;
        }, false>;
    }, false>;
}, false>>;
declare type EventEntry = Static<typeof EventEntry>;
export { Throtthler, EventEntry, Event };
//# sourceMappingURL=runtypes.d.ts.map