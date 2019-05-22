import express from 'express';
import { Guid } from "guid-typescript";
import errors from '../../common/errors';
import { IMatch } from '../../db/interfaces/IMatch';
import { apiHelpers } from '../../common/apiHelpers';
import { chessHelpers } from '../../common/chessHelpers';
import { chessFactory } from '../../common/chessFactory';
import { db } from '../../db';

export default {
	createMatch: (req: express.Request, res: express.Response) => {
		const user = apiHelpers.getProfilePayload(req);
		const orientation = req.body['orientation'];

		if (!(orientation && chessHelpers.piecesColors[orientation])) {
			res.send(400);
			return;
		}

		if (!user) {
			res.send(400);
			return;
		}

		const whiteP = orientation == chessHelpers.piecesColors.white ? user.sub : undefined;
		const blackP = orientation == chessHelpers.piecesColors.black ? user.sub : undefined;
		const match = chessFactory.createMatch(whiteP, blackP);

		db.Match.create(match)
			.then(m => {
				res.status(201).send(match);
			}).catch(err => {
				// todo: handle error
				res.send(400);
			});
	},

	joinMatch: (req: express.Request, res: express.Response) => {
		const matchId = req.params['id'];
		const user = apiHelpers.getProfilePayload(req);

		if (!matchId) {
			res.send(400);
			return;
		}

		if (!user) {
			res.send(400);
			return;
		}

		const findMatchPromise = db.Match.findById(matchId);
		findMatchPromise.then(m => {
			if (m) {
				if(m.blackP && m.whiteP) {
					res.send(400);
				}

				m.blackP = m.blackP || user.sub;
				m.whiteP = m.whiteP || user.sub;

				m.save().then(m => {
					res.status(200).send(m);
				}).catch(e => {
					res.send(400);
				});
			} else {
				res.send(404);
			}
		});
		findMatchPromise.catch(e => {
			res.send(400);
		});
	},

	getById: (req: express.Request, res: express.Response) => {
		const matchId = req.params['id'];
		const user = apiHelpers.getProfilePayload(req);

		if (!matchId) {
			res.send(400);
			return;
		}

		if (!user) {
			res.send(400);
			return;
		}

		db.Match.findById(matchId)
			.then(m => {
				if (!m) {
					res.send(404);
				} else if (m.whiteP !== user.sub && m.blackP !== user.sub) {
					res.send(400);
				} else {
					res.status(200).send(m);
				}
			}).catch(e => {
				res.send(400);
			});
	}
}
