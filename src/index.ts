import 'dotenv/config';
import * as http from 'http';
import * as express from 'express';
import * as component from './component';
import bodyParser from 'body-parser';

import { ThrottlerState, ThrottlerRequest } from './helpers/runtypes';

export const state: ThrottlerState = {};

const app: express.Application = express.default();

app.use(bodyParser.json());

app.post('/api/event', async (req, res) => {
    try {
        const events = ThrottlerRequest.check(req.body.events);

        const data = await component.throttler(events, state, Date.now());

        res.status(200).json(data);
    } catch (e) {
        console.log(e);
        res.status(500).send('error');
    }
});

app.set('port', process.env.PORT);
app.set('secret', process.env.SECRET);

const Server: http.Server = http.createServer(app);

Server.listen(app.get('port'), () => {
    console.log(`Listening on ${app.get('port')}`);

    /*crones.checkEvery7Day.start();
    crones.checkEveryDay.start();
    crones.checkEvery12Hour.start();
    crones.checkEvery2Hour.start();
    crones.checkEveryHour.start();
    crones.checkEvery30Minute.start();
    crones.checkEvery5Minute.start();
    crones.checkEvery1Minute.start();*/
});
