export interface IPieceColor {
	white: string,
	black: string
}

export interface IDictionary { [index: string]: string }

const piecesColors: IDictionary & IPieceColor = {
	white: 'white',
	black: 'black'
}

export const chessHelpers = {
	piecesColors,
}