import { IEvent } from '../../db/interfaces/IEvent';

export interface IChatEvent extends IEvent {
	sender: string;
	message: string;
}

export class ChatEvent implements IChatEvent {
	serverTime: number;
	id: string;
	type: 'move' | 'message' = 'message';
	match: string;
	sender: string;
	message: string;

	constructor(id: string, room: string, sender: string, message: string) {
		this.id = id;
		this.match = room;
		this.sender = sender;
		this.message = message;
		this.serverTime = Date.now();
	}
}