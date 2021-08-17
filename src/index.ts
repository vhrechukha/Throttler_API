import 'dotenv/config';
import * as http from 'http';
import * as express from 'express';
import throttle from './throttler';

import { T_State, RT_ThrottlerRequests } from './helpers/runtypes';
import { clearOldDataEvery5Minute } from './crons';

export const state: T_State = {};

const app: express.Application = express.default();

app.use(express.json());

app.post('/api/events', async (req, res) => {
    try {
        const events = RT_ThrottlerRequests.check(req.body.events);

        const data = await throttle(events, state, Date.now());

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

    clearOldDataEvery5Minute.start();
});
