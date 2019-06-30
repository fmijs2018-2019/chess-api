import { IMatch } from "../db/interfaces/IMatch";

export const chessFactory = {
	createMatch: (whiteP?: string, blackP?: string): IMatch => {
		return {
			whiteP: whiteP,
			blackP: blackP,
			isLive: true,
			isFinalized: false,
			startTime: new Date().toUTCString()		
		};
	}
}