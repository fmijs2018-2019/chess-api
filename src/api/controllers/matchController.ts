import express from 'express';
import { Guid } from "guid-typescript";
import { IApiResult } from '../../models/apiResult';
import { profilePayload } from '../..';
import errors from '../../common/errors';
import { IMatch } from '../../db/interfaces/IMatch';
import { liveMatches } from '../../liveMatches';
import { PiecesColors } from '../../models/pieces';

export default {
	createMatch: (req: express.Request, res: express.Response) => {
		const senderId = profilePayload && profilePayload.sub;
		const orientation = req.body['orientation'];

		if (!orientation) {
			//error
		}

		if (!senderId) {
			const error: IApiResult<any> = { isSuccess: false, error: errors.invalidSender }
			res.status(401).send(error);
			return;
		}

		const uid = Guid.create().toString();
		const newMatch: IMatch = {
			moves: [],
			chats: [],
			whiteP: orientation == PiecesColors.white ? senderId : undefined,
			blackP: orientation == PiecesColors.black ? senderId : undefined,
			isLive: false,
			isFinalized: false,
		};
		liveMatches[uid] = { match: newMatch, connectedPlayers: 1, fen: 'start' };
		orientation === PiecesColors.white ? liveMatches[uid].match.whiteP = senderId : liveMatches[uid].match.blackP = senderId;
		const result: IApiResult<any> = { data: { matchId: uid }, isSuccess: true };
		console.log(liveMatches[uid]);
		res.status(201).send(result);
	},

	joinMatch: (req: express.Request, res: express.Response) => {
		const matchId = req.params['id'];
		const senderId = profilePayload && profilePayload.sub;

		if (!matchId) {
			const error: IApiResult<any> = { isSuccess: false, error: errors.matchNotFound }
			res.status(400).send(error);
			return;
		}

		if (!senderId) {
			const error: IApiResult<any> = { isSuccess: false, error: errors.invalidSender }
			res.status(400).send(error);
			return;
		}

		const liveMatch = liveMatches[matchId];

		if (!liveMatch) {
			const error: IApiResult<any> = { isSuccess: false, error: errors.matchNotFound }
			res.status(404).send(error);
			return;
		}

		liveMatch.connectedPlayers++;

		if (liveMatch.match.whiteP !== senderId && !liveMatch.match.blackP) {
			liveMatch.match.blackP = senderId;
		} else if (!liveMatch.match.whiteP && liveMatch.match.blackP !== senderId) {
			liveMatch.match.whiteP = senderId;
		}

		console.log(liveMatch);
		const result: IApiResult<any> = { isSuccess: true, data: { fen: liveMatch.fen } };
		res.status(200).send(result);
	},

	getAll: (req: express.Request, res: express.Response) => {
		const result: IApiResult<any> = {
			data: {
				liveMatches
			},
			isSuccess: true
		}
		res.status(200).send(result);
	}
}
