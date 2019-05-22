import * as mongoose from 'mongoose';
import { Guid } from 'guid-typescript';

export interface IEvent {
	id: string;
	type: string;
	serverTime: string;
}
