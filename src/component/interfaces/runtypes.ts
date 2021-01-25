import { Record, Number, Static, String, Union, Literal } from 'runtypes';

const Kind = Union(Literal('points'), Literal('count'));

const PerInEventRuntypeExist = Record({
    per: String,
    max: Number,
    kind: Kind,
});

type PerInEventRuntypeExist = Static<typeof PerInEventRuntypeExist>;

const PerInEventRuntypeNotExist = Record({
    max: Number,
    kind: Kind,
});

type PerInEventRuntypeNotExist = Static<typeof PerInEventRuntypeNotExist>;

export { PerInEventRuntypeExist, PerInEventRuntypeNotExist };
