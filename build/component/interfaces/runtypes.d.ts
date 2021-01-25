import { Record, Number, Static, String, Literal } from 'runtypes';
declare const PerInEventRuntypeExist: Record<{
    per: String;
    max: Number;
    kind: import("runtypes").Union2<Literal<"points">, Literal<"count">>;
}, false>;
declare type PerInEventRuntypeExist = Static<typeof PerInEventRuntypeExist>;
declare const PerInEventRuntypeNotExist: Record<{
    max: Number;
    kind: import("runtypes").Union2<Literal<"points">, Literal<"count">>;
}, false>;
declare type PerInEventRuntypeNotExist = Static<typeof PerInEventRuntypeNotExist>;
export { PerInEventRuntypeExist, PerInEventRuntypeNotExist };
//# sourceMappingURL=runtypes.d.ts.map