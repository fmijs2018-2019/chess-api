import { IMatch, MatchResult } from "../db/interfaces/IMatch";

export const chessFactory = {
	createMatch: (whiteP?: string, blackP?: string, time?: number): IMatch => {
		return {
			whiteP: whiteP,
			blackP: blackP,
			isLive: true,
			isFinalized: false,
			startTime: new Date().toUTCString(),
			totalTime: time,
			timeExpired: false,
			isTimeGame: time !== undefined && time !== null && time > 0,
			matchResult: MatchResult.NoResult,
		};
	}
}