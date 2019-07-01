import * as mongoose from 'mongoose';
import { IMatchChatDocument } from '../interfaces/IMatch';

export const matchMessageSchema = new mongoose.Schema({
	type: Number,
	serverTime: String,
	sender: String, // userId
	message: String
});

export const matchChatSchema = new mongoose.Schema({
	matchId: mongoose.Schema.Types.ObjectId,
	messages: [matchMessageSchema],
});

export const MatchChat: mongoose.Model<IMatchChatDocument> = mongoose.model<IMatchChatDocument>('MatchChat', matchChatSchema);
