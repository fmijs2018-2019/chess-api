import mongoose, { Schema } from 'mongoose';
import { Match } from './schemas/matchSchema';
import { MatchMoves } from './schemas/matchMovesSchema';
import { MatchChat } from './schemas/matchChatSchema';

const host = process.env.HOSTNAME || 'localhost';
const name = process.env.DBNAME || 'chess';
const port = process.env.DBPORT || 27017;

mongoose.connect(`mongodb://${host}:${port}/${name}`, { useNewUrlParser: true })
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
