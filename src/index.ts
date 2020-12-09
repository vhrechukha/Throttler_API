import * as http from 'http';
import * as express from 'express';
import * as Middleware from './middleware';
import * as serverHandlers from './serverHandlers';
import * as component from './component';

/*
 * Configure app
 */
const app: express.Application = express();

Middleware.configure(app);

app.post('/api/event', component.throtthler);

app.set('port', process.env.PORT || 3000);
app.set('secret', process.env.SECRET || 'superSecret');

const Server: http.Server = http.createServer(app);

/**
 * Binds and listens for connections on the specified host
 */
Server.listen(app.get('port'));

/**
 * Server Events
 */
Server.on('error', (error: Error) =>
  serverHandlers.onError(error, app.get('port')),
);

Server.on('listening', serverHandlers.onListening.bind(Server));
