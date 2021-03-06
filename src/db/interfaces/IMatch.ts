import { IMove } from "./IMove";
import { IMessage } from "./IMessage";
import * as mongoose from 'mongoose';

export interface IMatch {
    result?: string,
    totalTime?: number,
    whiteP?: string,
    blackP?: string,
    startTime?: string,
    endTime?: string,
    isLive: boolean,
    isFinalized: boolean,
	winner?: string,
	timeExpired: boolean,
	isTimeGame: boolean,
	matchResult: number,
};

export enum MatchResult {
	NoResult = 0,
	Checkmate = 1,
	Stalemate = 2,
	InsufficentMaterial = 3,
	ThreefoldRepetition = 4,
	Draw = 5,
	OutOfTime = 6,
}

export interface IMatchDocument extends IMatch, mongoose.Document {

}

export interface IMatchMoves {
	matchId: IMatchDocument['_id'],
	moves: IMove[]
}

export interface IMatchMovesDocument extends IMatchMoves, mongoose.Document {

}

export enum EventType {
	MessageEvent = 0,
	MoveEvent = 1,
}

export interface IMatchChat {
	matchId: IMatchDocument['_id'],
	messages: IMessage[]
}

export interface IMatchChatDocument extends IMatchChat, mongoose.Document {

}
