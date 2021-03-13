"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.state = void 0;
require("dotenv/config");
const http = __importStar(require("http"));
const express = __importStar(require("express"));
const component = __importStar(require("./component"));
const body_parser_1 = __importDefault(require("body-parser"));
const runtypes_1 = require("./helpers/runtypes");
const crones = __importStar(require("./crones"));
exports.state = {};
const app = express.default();
app.use(body_parser_1.default.json());
app.post('/api/event', async (req, res) => {
    const { events } = req.body;
    if (runtypes_1.Throtthler.guard(events)) {
        const data = await component.throttler(events, exports.state, Date.now());
        res.status(200).json(data);
    }
});
app.set('port', process.env.PORT);
app.set('secret', process.env.SECRET);
const Server = http.createServer(app);
Server.listen(app.get('port'), () => {
    console.log(`Listening on ${app.get('port')}`);
    crones.checkEvery7Day.start(),
        crones.checkEveryDay.start(),
        crones.checkEvery12Hour.start(),
        crones.checkEvery2Hour.start(),
        crones.checkEveryHour.start();
    crones.checkEvery30Minute.start();
    crones.checkEvery5Minute.start();
    crones.checkEvery1Minute.start();
});
//# sourceMappingURL=index.js.map