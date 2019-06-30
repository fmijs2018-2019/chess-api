import * as mongoose from 'mongoose';
import { IMatch, IMatchDocument } from '../interfaces/IMatch';

export const matchSchema =  new mongoose.Schema({
    result: String,
    totalTime: Number,
    whiteP: String,
    blackP: String,
    startTime: String,
    endTime: String,
    isLive: Boolean,
    isFinalized: Boolean,
	winner: String,
	timeExpired: Boolean,
	isTimeGame: Boolean,
});

export const Match: mongoose.Model<IMatchDocument> = mongoose.model<IMatchDocument>('Match', matchSchema);
