import { MatchChat } from './schemas/matchChatSchema';
import mongoose, { Schema } from 'mongoose';
import { Match } from './schemas/matchSchema';
import { MatchMoves } from './schemas/matchMovesSchema';

const host = process.env.DBHOSTNAME;
const name = process.env.DBNAME;
const port = process.env.DBPORT;

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
