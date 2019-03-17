import { IEvent } from '../../db/interfaces/IEvent';
import { IMove } from '../../db/interfaces/IMove';

export interface IMoveEvent extends IEvent {
	move: IMove;
}

export class MoveEvent implements IMoveEvent {
	move: IMove;
	id: string;	
	type: 'move' | 'message' = 'move';
	serverTime: number;
	match: string;

	constructor(id: string, room: string, move: IMove) {
		this.id = id;
		this.match = room;
		this.move = move;
		this.serverTime = Date.now();
	}
}
