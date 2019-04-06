import { IEventBase } from "./eventBase";

export interface IMoveEvent extends IEventBase {
	shortMove: IShortMove,
	fen: string
}

// from chess.js
interface IShortMove {
	from: string,
	to: string,
	promotion: string,
}