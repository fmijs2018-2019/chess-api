import { IMove } from "./IMove";
import { IMessage } from "./IMessage";

export interface IMatch {
    moves: IMove[],
    chats: IMessage[],
    result?: string,
    totalTime?: number,
    whiteP?: string,
    blackP?: string,
    startTime?: Date,
    endTime?: Date,
    isLive: boolean,
    isFinalized: boolean,
    winner?: string
};
