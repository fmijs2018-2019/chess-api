import { MatchChat } from './schemas/matchChatSchema';
import mongoose, { Schema } from 'mongoose';
import { Match } from './schemas/matchSchema';
import { MatchMoves } from './schemas/matchMovesSchema';

const connectionStr = process.env.CONNECTIONSTR || '';
console.log(connectionStr);

mongoose.connect(connectionStr, { useNewUrlParser: true })
	.then(res => {
		console.log("Connected to Mongodb!");
	}).catch(err => {
		console.log(err);
	});

export const db = {
	connection: mongoose.connection,
	MatchMoves,
	MatchChat,
	Match
};
