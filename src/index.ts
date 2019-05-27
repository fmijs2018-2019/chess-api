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
import { IMove } from './db/interfaces/IMove';
import { EventType } from './db/interfaces/IMatch';
import { IMessage } from './db/interfaces/IMessage';


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
	console.log('user connected');

	// user connected
	socket.emit(lobbyEvents.getChallenges, challengeService.challenges);

	socket.on(lobbyEvents.createChallenge, function (challenge, fn) {
		const newChallenge: IChallenge = {
			id: Guid.create().toString(),
			socketId: socket.id,
			sub: challenge.userId,
			time: challenge.time,
			pieces: challenge.pieces,
		}
		console.log('challenge created', newChallenge);
		challengeService.addChallenge(newChallenge);

		if (fn) {
			fn(newChallenge);
		}

		socket.broadcast.emit(lobbyEvents.onChallengeCreate, newChallenge);
	});

	socket.on(lobbyEvents.removeChallenge, function (challengeId) {
		const removed = challengeService.removeById(challengeId);
		if (removed) {
			console.log('challenge removed', challengeId);
			socket.broadcast.emit(lobbyEvents.onChallengeRemove, [challengeId]);
		}
	});

	socket.on(lobbyEvents.approveChallenge, function ({ challengeId, userId }) {
		const challenge = challengeService.getById(challengeId);
		if (challenge) {
			challengeService.removeById(challengeId);
			socket.broadcast.emit(lobbyEvents.onChallengeRemove, [challengeId]);

			const blackP = challenge.pieces === chessHelpers.piecesColors.black ? challenge.sub : userId;
			const whiteP = challenge.pieces === chessHelpers.piecesColors.white ? challenge.sub : userId;
			const match = chessFactory.createMatch(whiteP, blackP);

			db.Match.create(match)
				.then((matchDocument) => {
					console.log('challenge approved', challenge);

					// fire and forget for now
					db.MatchChat.create({ matchId: matchDocument.id, messages: [] });
					db.MatchMoves.create({ matchId: matchDocument.id, moves: [] });

					socket.emit(lobbyEvents.onChallengeApprove, matchDocument.id);
					lobbyNsp.to(`${challenge.socketId}`).emit(lobbyEvents.onChallengeApprove, matchDocument.id);
				}).catch(() => {
					// handle error
				});
		}
	});

	socket.on('disconnect', function () {
		console.log('user diconnected');
		// user disconnected
		const ids = challengeService.removeAllBySocketId(socket.id);
		if (ids.length > 0) {
			console.log('challenge removed', ids);
			socket.broadcast.emit(lobbyEvents.onChallengeRemove, ids);
		}
	});
});

const gameEvents = {
	joinGame: 'joinGame',
	makeMove: 'makeMove',
	onMove: 'onMove',
	sendMesssage: 'sendMessage',
	receiveMessage: 'receiveMessage',
};

const gameNsp = io.of('/game');
gameNsp.on('connection', function (socket) {
	// user connected

	socket.on(gameEvents.joinGame, function (matchId, fn) {
		socket.join('matchId');
		db.Match.findById(matchId)
			.then(doc => {
				if (doc && fn) {
					fn(doc);
				}
			}).catch(err => {
				// error
			})
	});

	socket.on(gameEvents.makeMove, function ({matchId, move}) {
		if (matchId) {
			const domain: IMove = {
				id: Guid.create().toString(),
				playerId: move.playerId,
				source: move.source,
				dest: move.dest,
				newFENPos: move.newFENPos,
				oldFENPos: move.oldFENPos,
				piece: move.piece,
				serverTime: new Date().toUTCString(),
				time: move.time,
				type: EventType.MoveEvent
			}
			db.MatchMoves.update({ MatchId: matchId }, 
				{ $push: { moves: domain } },
				(doc) => {
					if (doc) {
						socket.broadcast.to(matchId).emit(gameEvents.onMove, doc);
					}
				}
			);
		}
	});

	socket.on(gameEvents.sendMesssage, function ({matchId, chatMessage}) {
		if (matchId) {
			const domain: IMessage = {
				id: Guid.create().toString(),
				sender: {
					userId: chatMessage.sender.userId,
					email: chatMessage.sender.email,
					family_name: chatMessage.sender.family_name,
					given_name: chatMessage.sender.given_name,
					name: chatMessage.sender.name,
					picture: chatMessage.sender.picture
				},
				serverTime: new Date().toUTCString(),
				type: EventType.MoveEvent,
				message: chatMessage.message
			}
			db.MatchChat.update({ MatchId: matchId }, 
				{ $push: { moves: domain } },
				(doc) => {
					if (doc) {
						socket.broadcast.to(matchId).emit(gameEvents.receiveMessage, doc);
					}
				}
			);
		}
	});

	socket.on('disconnect', function () {
		// user disconnected
	});
});

// socket.io end

server.listen(port);

console.log(`Server running on http://localhost:${port}`);
