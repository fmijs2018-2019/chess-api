import { IEvent } from "./IEvent";
import { IProfile, IUser } from "../../models/auth/IProfilePayload";

export interface IMessage extends IEvent {
	sender: IUser,
	message: string
}