export interface IPieceColor {
	white: string,
	black: string
}

export interface IDictionary<T> { [index: string]: T }

const piecesColors: IDictionary<string> & IPieceColor = {
	white: 'white',
	black: 'black'
}

export const chessHelpers = {
	piecesColors,
}