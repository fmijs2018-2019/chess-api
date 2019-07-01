import * as mongoose from 'mongoose';
import { IMatchMovesDocument } from '../interfaces/IMatch';

export const moveSchema = new mongoose.Schema({
	// id: String,
	type: Number,
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
	time: Number,
	inCheck: Boolean,
	inCheckmate: Boolean,
	inDraw: Boolean,
	inStalemate: Boolean,
	inThreefoldRepetition: Boolean,
	insufficientMaterial: Boolean,
	gameOver: Boolean,
	moveMadeAt: String
});

export const matchMovesSchema = new mongoose.Schema({
	matchId: mongoose.Schema.Types.ObjectId,
	moves: [moveSchema],
});


export const MatchMoves: mongoose.Model<IMatchMovesDocument> = mongoose.model<IMatchMovesDocument>('MatchMoves', matchMovesSchema);
