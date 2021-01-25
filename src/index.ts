import * as http from 'http';
import { throttler } from './component/index';
import collectData from './helpers/collectData';
import Event from './component/interfaces/event-interface';
import EventEntry from './component/interfaces/eventEntry-interface';

let events: EventEntry[] = [
    {
        event: 'pastebin.com/prod/users/kotik',
        points: 456,
        date: Date.now(),
    },
];

const server = http.createServer((req, res) => {
    if (req.url === '/api/event' && req.method === 'POST') {
        collectData(req, async (formattedData: { events: Event }) => {
            const data = await throttler(formattedData, events, Date.now());
            if (data.newState !== null) events = data.newState;

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(data));
            res.end();
        });
    } else {
        res.writeHead(404);
        res.write('Not Found');
        res.end();
    }
});

server.listen(3000);
