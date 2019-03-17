import './config';
import cors = require('cors');
import bodyParser from 'body-parser';
import express from 'express';
import http from 'http';
import { db } from './db';
import { Match, IMatchModel, matchSchema } from './db/schemas/matchSchema';
import path from 'path';
import * as socketio from 'socket.io';
import { IEvent } from './db/interfaces/IEvent';
import gameRouter from './api/routes/matchRouter';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(function (req, res, next) {
	res.setHeader('Last-Modified', (new Date()).toUTCString());
	next();
});
app.use('/matches', gameRouter);

const port = process.env.PORT || 8080;
const server = new http.Server(app);
export const io = socketio.listen(server);

db.on('error', (err) => console.log(err));
db.once('open', function () {
	console.log('db connected');
});

server.listen(port);

console.log(`Server running on http://localhost:${port}`);
