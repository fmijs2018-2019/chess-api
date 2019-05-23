import bodyParser from 'body-parser';
import express from 'express';
import helmet from 'helmet';
import http from 'http';
import socketio from 'socket.io';
import matchRouter from './api/routes/matchRouter';
import './config';
import cors = require('cors');
import { IChallenge, challengeService } from './common/challengeService';
import { Guid } from 'guid-typescript';
import { chessFactory } from './common/chessFactory';
import { chessHelpers } from './common/chessHelpers';
import { db } from './db';


const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(function (req, res, next) {
	res.setHeader('Last-Modified', (new Date()).toUTCString());
	next();
});

app.use('/matches', matchRouter);

const port = process.env.PORT || 8080;
const server = new http.Server(app);
export const io = socketio.listen(server);

// socket.io start
const lobbyEvents = {
	getChallenges: 'getChallenges',

	createChallenge: 'createChallenge',
	removeChallenge: 'removeChallenge',
	approveChallenge: 'approveChallenge',

	onChallengeCreate: 'onChallengeCreate',
	onChallengeRemove: 'onChallengeRemove',
	onChallengeApprove: 'onChallengeApprove',
}

const lobbyNsp = io.of('/lobby');
lobbyNsp.on('connection', function (socket) {
	// user connected
	socket.emit(lobbyEvents.getChallenges, challengeService.challenges);

	socket.on(lobbyEvents.createChallenge, function (challenge) {
		const newChallenge: IChallenge = {
			id: Guid.create().toString(),
			socketId: socket.id,
			sub: challenge.userId,
			time: challenge.time,
			pieces: challenge.pieces,
		}
		challengeService.addChallenge(challenge);
		socket.broadcast.emit(lobbyEvents.onChallengeCreate, newChallenge);
	});

	socket.on(lobbyEvents.removeChallenge, function (challengeId) {
		const removed = challengeService.removeById(challengeId);
		if (removed) {
			socket.broadcast.emit(lobbyEvents.onChallengeRemove, [challengeId]);
		}
	});

	socket.on(lobbyEvents.approveChallenge, function (challengeId, userId) {
		const challenge = challengeService.getById(challengeId);
		if (challenge) {
			challengeService.removeById(challengeId);
			socket.broadcast.emit(lobbyEvents.onChallengeRemove, [ challengeId ]);

			const blackP = challenge.pieces === chessHelpers.piecesColors.black ? challenge.sub : userId;
			const whiteP = challenge.pieces === chessHelpers.piecesColors.white ? challenge.sub : userId;
			const match = chessFactory.createMatch(whiteP, blackP);

			db.Match.create(match)
				.then((matchDocument) => {
					socket.emit(lobbyEvents.onChallengeApprove, matchDocument.id);
					lobbyNsp.to(`${challenge.socketId}`).emit(lobbyEvents.onChallengeApprove, matchDocument.id);
				}).catch(() => {
					// handle error
				});
		}
	});
	
	socket.on('disconnect', function () {
		// user disconnected
		const ids = challengeService.removeAllBySocketId(socket.id);
		if (ids.length > 0) {
			socket.broadcast.emit(lobbyEvents.onChallengeRemove, ids);
		}
	});
});

const matchNsp = io.of('/match');
matchNsp.on('connection', function (socket) {
	// user connected

	socket.on('disconnect', function () {
		// user disconnected
	});
});

// socket.io end

server.listen(port);

console.log(`Server running on http://localhost:${port}`);
