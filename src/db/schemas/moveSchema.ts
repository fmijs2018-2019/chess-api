import * as mongoose from 'mongoose';
import { IMove } from '../interfaces/IMove';

export interface IMoveModel extends IMove, mongoose.Document {}

export const moveSchema = new mongoose.Schema({
    playerId: String,
    source: String,
    dest: String,
    piece: String,
    newFENPos: String,
    oldFENPos: String,
    time: Date,
});

export const Move: mongoose.Model<IMoveModel> = mongoose.model<IMoveModel>('Move', moveSchema);
