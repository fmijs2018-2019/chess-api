import { IMatch } from "../db/interfaces/IMatch";

export const chessFactory = {
	createMatch: (whiteP?: string, blackP?: string, time?: number): IMatch => {
		return {
			whiteP: whiteP,
			blackP: blackP,
			isLive: true,
			isFinalized: false,
			totalTime: time,
			timeExpired: false,
			isTimeGame: time !== undefined && time !== null && time > 0
		};
	}
}