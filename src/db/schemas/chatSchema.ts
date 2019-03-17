import * as mongoose from 'mongoose';
import { IChatEvent } from '../../interfaces/events/IChatEvent';

export interface IChatModel extends IChatEvent, mongoose.Document {}

export const chatSchema = new mongoose.Schema({
    sender: String,
    message: String,
});

export const Chat: mongoose.Model<IChatModel> = mongoose.model<IChatModel>('Chat', chatSchema);
