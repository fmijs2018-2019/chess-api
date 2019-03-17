import * as mongoose from 'mongoose';
import { IMatch } from '../interfaces/IMatch';
import { moveSchema } from "./moveSchema";
import { chatSchema } from "./chatSchema";

export interface IMatchModel extends IMatch, mongoose.Document {}

export const matchSchema =  new mongoose.Schema({
    moves: [moveSchema],
    chats: [chatSchema],
    result: String,
    totalTime: Number,
    whiteP: String,
    blackP: String,
    startTime: Date,
    endTime: Date,
    isLive: Boolean,
    isFinalized: Boolean,
    winner: String
});

export const Match: mongoose.Model<IMatchModel> = mongoose.model<IMatchModel>('Match', matchSchema);
