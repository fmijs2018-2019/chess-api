export interface IMatch {
    moves: [{}],
    chats: [{}],
    result: string,
    totalTime: number,
    whiteP: string,
    blackP: string,
    startTime: Date,
    endTime: Date,
    isLive: boolean,
    isFinalized: boolean,
    winner: string
};
