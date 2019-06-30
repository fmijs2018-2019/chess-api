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
import { EventType, IMatchChat } from './db/interfaces/IMatch';
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

	socket.on(lobbyEvents.createChallenge, function (challenge, fn?: any) {
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

	socket.on(lobbyEvents.removeChallenge, function (challengeId: string) {
		const removed = challengeService.removeById(challengeId);
		if (removed) {
			console.log('challenge removed', challengeId);
			socket.broadcast.emit(lobbyEvents.onChallengeRemove, [challengeId]);
		}
	});

	socket.on(lobbyEvents.approveChallenge, function (challengeId: string, userId: string) {
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
	onMessage: 'onMessage',
};

const gameNsp = io.of('/game');
gameNsp.on('connection', function (socket) {
	// user connected

	socket.on(gameEvents.joinGame, function (matchId: string, fn?: any) {
		socket.join(matchId);
		var p1 = db.Match.findById(matchId);
		var p2 = db.MatchMoves.findOne({ matchId });
		var p3 = db.MatchChat.find({ matchId });
		Promise.all([p1, p2, p3])
			.then(([match, moves, chat]) => {
				if (fn) {
					fn(match, moves, chat);
				}
			}).catch(err => {
				// error
			})
	});

	socket.on(gameEvents.makeMove, function (matchId: string, move: IMove) {
		if (matchId) {
			const domain: IMove = {
				from: move.from,
				to: move.to,
				color: move.color,
				flags: move.flags,
				san: move.san,
				captured: move.captured,
				promotion: move.promotion,
				newFENPos: move.newFENPos,
				oldFENPos: move.oldFENPos,
				piece: move.piece,
				serverTime: new Date().toUTCString(),
				time: move.time,
				type: EventType.MoveEvent,
				gameOver: move.gameOver,
				inCheck: move.inCheck,
				inCheckmate: move.inCheck,
				inDraw: move.inDraw,
				inStalemate: move.inStalemate,
				inThreefoldRepetition: move.inThreefoldRepetition,
				insufficientMaterial: move.insufficientMaterial
			}

			db.MatchMoves.updateOne({ matchId: matchId },
				{ $push: { moves: domain } }, {}, (err, res) => {
					if (res && res.ok) {
						socket.broadcast.to(matchId).emit(gameEvents.onMove, domain);
					}
				});
		}
	});

	socket.on(gameEvents.sendMesssage, function (matchId: string, chatMessage: IMessage) {
		if (matchId) {
			const domain: IMessage = {
				sender: chatMessage.sender,
				serverTime: new Date().toUTCString(),
				type: EventType.MoveEvent,
				message: chatMessage.message
			}
			db.MatchChat.updateOne({ matchId: matchId },
				{ $push: { messages: domain } }, {}, (err, res) => {
					if (res && res.ok) {
						socket.broadcast.to(matchId).emit(gameEvents.onMessage, domain);
					}
				});
		}
	});

	socket.on('disconnect', function () {
		// user disconnected
	});
});

// socket.io end

server.listen(port);

console.log(`Server running on http://localhost:${port}`);
