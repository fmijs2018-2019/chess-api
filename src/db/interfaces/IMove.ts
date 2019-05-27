import { IEvent } from "./IEvent";

export interface IMove extends IEvent {
    playerId: string, // sub claim from IProfilePayload
    from: string,
	to: string,
	color: string,
	flags: string,
	san: string,
	captured?: string,
	promotion?: string,
    piece: string,
    newFENPos: string,
    oldFENPos: string,
    time: number,
}