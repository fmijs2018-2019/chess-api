import { IMatch } from "./db/interfaces/IMatch";

export const liveMatches: { 
	[id: string] : {
		match: IMatch,
		connectedPlayers: number,
		fen: string,
	};
 } = {};