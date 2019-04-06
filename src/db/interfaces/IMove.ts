import { IEvent } from "./IEvent";

export interface IMove extends IEvent {
    playerId: string,
    source: string,
    dest: string,
    piece: string,
    newFENPos: string,
    oldFENPos: string,
    time: Date,
}