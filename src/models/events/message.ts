import { IEventBase } from "./eventBase";

export interface IMessageEvent extends IEventBase {
	message: string
}