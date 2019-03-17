import express from 'express';
import { io } from '../..';
import { IEvent } from '../../db/interfaces/IEvent';
import { Match } from '../../db/schemas/matchSchema';

export default {
	joinMatch: (req: express.Request, res: express.Response) => {
		const matchId = req.query['match'];
		if (matchId) {
			io.on('connect', (socket: SocketIO.Socket) => {
				socket.join(matchId);
				socket.on('event', (event: IEvent) => {
					io.to(event.match).emit('event', event);
					console.log(event.type);
				})

				socket.on('disconnect', () => {
					console.log('Client disconnected');
				});

			});
		}
	},

	getAll: (req: express.Request, res: express.Response) => {
		Match.find((err, data) => {
			res.json(data);
		})
	},

	getOpen: (req: express.Request, res: express.Response) => {
		Match.find({isLive: false, isFinalized: false},(err, data) => {
			res.json(data);
		})
	}
}