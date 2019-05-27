import { IEvent } from "./IEvent";

export interface IMessage extends IEvent {
	sender: string,
	message: string
}