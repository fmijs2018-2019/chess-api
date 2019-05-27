import * as mongoose from 'mongoose';
import { IMatchMovesDocument } from '../interfaces/IMatch';

export const matchMovesSchema = new mongoose.Schema({
	matchId: mongoose.Schema.Types.ObjectId,
	moves: [
		{
			id: String,
			type: String,
			serverTime: String,
			playerId: String,
			from: String,
			to: String,
			color: String,
			flags: String,
			san: String,
			captured: String,
			promotion: String,
			piece: String,
			newFENPos: String,
			oldFENPos: String,
			time: Number
		}
	],
});

export const MatchMoves: mongoose.Model<IMatchMovesDocument> = mongoose.model<IMatchMovesDocument>('MatchMoves', matchMovesSchema);