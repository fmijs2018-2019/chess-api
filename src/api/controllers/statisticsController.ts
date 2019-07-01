import express from 'express';
import { db } from '../../db';
import { IUserStatistics } from '../../models/IUserStatistics';

export default {

	getByUserId: (req: express.Request, res: express.Response) => {
		const user = (req as any).user;

		let statistics: IUserStatistics;

		db.Match.find({ $or: [{ whiteP: user.sub }, { blackP: user.sub }] })
			.then(matches => {
				statistics = {
					totalGamesCount: matches.length,
					totalGamesAsBlack: matches.filter(m => m.blackP === user.sub).length,
					totalGamesAsWhite: matches.filter(m => m.whiteP === user.sub).length,
					totalLoses: matches.filter(m => (m.whiteP === user.sub && m.winner === 'b') || (m.blackP === user.sub && m.winner === 'w')).length,
					totalWins: matches.filter(m => (m.whiteP === user.sub && m.winner === 'w') || (m.blackP === user.sub && m.winner === 'b')).length,
					totalDraws: matches.filter(m => !m.winner).length
				}

				res.status(200).send(statistics);
			}).catch(() => {
				res.sendStatus(400);
			});
	},
}
