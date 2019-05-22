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
import { IProfilePayload } from './models/auth/IProfilePayload';
import helmet from 'helmet';

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(function (req, res, next) {
	res.setHeader('Last-Modified', (new Date()).toUTCString());
	next();
});

export interface IClaimsHelper {
	payload?: IProfilePayload
}

app.use('/matches', matchRouter);

const port = process.env.PORT || 8080;
const server = new http.Server(app);
export const io = socketio.listen(server);

//todo: sockets logic

server.listen(port);

console.log(`Server running on http://localhost:${port}`);
