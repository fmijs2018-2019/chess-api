import * as mongoose from 'mongoose';
import { IMatchChatDocument } from '../interfaces/IMatch';

export const matchChatSchema = new mongoose.Schema({
	matchId: mongoose.Schema.Types.ObjectId,
	messages: [
		{
			id: String,
			type: String,
			serverTime: String,
			sender: {
				userId: String,
				given_name: String,
				family_name: String,
				name: String,
				email: String,
				picture: String
			},
			message: String
		}
	],
});

export const MatchChat: mongoose.Model<IMatchChatDocument> = mongoose.model<IMatchChatDocument>('MatchChat', matchChatSchema);
