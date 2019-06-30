import { IEvent } from "./IEvent";

export interface IMove extends IEvent {
    newFENPos: string,
	oldFENPos: string,
	time?: number,
    color: string;
    flags: string;
    piece: string;
    san: string;
	captured?: string;
    from: string;
    to: string;
	promotion?: string;
	inCheck: boolean,
	inCheckmate: boolean,
	inDraw: boolean,
	inStalemate: boolean,
	inThreefoldRepetition: boolean,
	insufficientMaterial: boolean,
	gameOver: boolean
}