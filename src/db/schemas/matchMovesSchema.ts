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
			source: String,
			dest: String,
			piece: String,
			newFENPos: String,
			oldFENPos: String,
			time: Number,
		}
	],
});

export const MatchMoves: mongoose.Model<IMatchMovesDocument> = mongoose.model<IMatchMovesDocument>('MatchMoves', matchMovesSchema);
