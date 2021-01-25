"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerInEventRuntypeNotExist = exports.PerInEventRuntypeExist = void 0;
const runtypes_1 = require("runtypes");
const Kind = runtypes_1.Union(runtypes_1.Literal('points'), runtypes_1.Literal('count'));
const PerInEventRuntypeExist = runtypes_1.Record({
    per: runtypes_1.String,
    max: runtypes_1.Number,
    kind: Kind,
});
exports.PerInEventRuntypeExist = PerInEventRuntypeExist;
const PerInEventRuntypeNotExist = runtypes_1.Record({
    max: runtypes_1.Number,
    kind: Kind,
});
exports.PerInEventRuntypeNotExist = PerInEventRuntypeNotExist;
//# sourceMappingURL=runtypes.js.map