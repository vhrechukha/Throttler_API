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
const http = __importStar(require("http"));
const index_1 = require("./component/index");
const collectData_1 = __importDefault(require("./helpers/collectData"));
let events = [
    {
        event: 'pastebin.com/prod/users/kotik',
        points: 456,
        date: Date.now(),
    },
];
const server = http.createServer((req, res) => {
    if (req.url === '/api/event' && req.method === 'POST') {
        collectData_1.default(req, async (formattedData) => {
            const data = await index_1.throtthler(formattedData, events, Date.now());
            if (data.newState !== null)
                events = data.newState;
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(data));
            res.end();
        });
    }
    else {
        res.writeHead(404);
        res.write('Not Found');
        res.end();
    }
});
server.listen(3000);
//# sourceMappingURL=index.js.map