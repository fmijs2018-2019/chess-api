import { IEvent } from "./IEvent";
import { IProfile } from "../../models/auth/IProfilePayload";

export interface IMessage extends IEvent {
	sender: IProfile,
	message: string
}