import { IEvent } from "./IEvent";

export interface IMove extends IEvent {
    playerId: string, // sub claim from IProfilePayload
    source: string,
    dest: string,
    piece: string,
    newFENPos: string,
    oldFENPos: string,
    time: number,
}