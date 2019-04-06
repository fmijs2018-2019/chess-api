import * as mongoose from 'mongoose';
import { IMessage } from '../interfaces/IMessage';

export interface IChatModel extends IMessage, mongoose.Document {}

export const chatSchema = new mongoose.Schema({
	room: String,
    sender: String,
    message: String,
});

export const Chat: mongoose.Model<IChatModel> = mongoose.model<IChatModel>('Chat', chatSchema);
