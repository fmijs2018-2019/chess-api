export interface IEvent {
	// id: string;
	type: 'move' | 'message';
	serverTime: number;
	match: string;
}