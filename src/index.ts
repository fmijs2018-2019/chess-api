import './config';
import cors = require('cors');
import bodyParser from 'body-parser';
import express from 'express';
import http from 'http';
import { db } from './db';
import * as socketio from 'socket.io';
import matchRouter from './api/routes/matchRouter';
import { IJoinEvent } from './models/events/join';
import { IMoveEvent } from './models/events/move';
import { IMessageEvent } from './models/events/message';
import jwt_decode from 'jwt-decode';
import { IProfilePayload } from './models/auth/IProfilePayload';
import helmet from 'helmet';
import { liveMatches } from './liveMatches';

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(function (req, res, next) {
	res.setHeader('Last-Modified', (new Date()).toUTCString());
	next();
});

export let profilePayload: IProfilePayload | undefined | '';
app.use(function (req, res, next) {
	const token = req && req.headers && req.headers.authorization;
	profilePayload = token && jwt_decode(token);
	next();
})
app.use('/matches', matchRouter);

const port = process.env.PORT || 8080;
const server = new http.Server(app);
export const io = socketio.listen(server);

io.on('connect', (socket: SocketIO.Socket) => {
	socket.on('joinMatch', (event: IJoinEvent) => {
		if (!event || !event.room) return;
		const liveMatch = liveMatches[event.room];
		console.log(event.sender, ' joined');

		if (liveMatch && liveMatch.match.blackP === event.sender || liveMatch.match.whiteP === event.sender) {
			socket.join(event.room);
		}
	});

	socket.on('move', (event: IMoveEvent) => {
		if (!event || !event.room) return;
		const liveMatch = liveMatches[event.room];

		if ((liveMatch && liveMatch.match.blackP === event.sender) || (liveMatch && liveMatch.match.whiteP === event.sender)) {		
			socket.to(event.room).emit('move', event);
			liveMatch.fen = event.fen;
		};
	});

	socket.on('message', (event: IMessageEvent) => {
		console.log(event.message);
		socket.to(event.room).emit('message', event.message);
	});

	socket.on('disconnect', (e) => {
		console.log('Client disconnected');
		console.log(e);
	});

});

db.on('error', (err) => console.log(err));
db.once('open', function () {
	console.log('db connected');
});

server.listen(port);

console.log(`Server running on http://localhost:${port}`);
