export interface IMove {
    playerId: string,
    source: string,
    dest: string,
    piece: string,
    newFENPos: string,
    oldFENPos: string,
    time: Date,
}