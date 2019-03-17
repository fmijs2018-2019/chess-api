import mongoose, { Schema } from 'mongoose';
import { IMatchModel, Match } from './schemas/matchSchema';

const host = process.env.HOSTNAME;
const name = process.env.DBNAME;
const port = process.env.DBPORT;

mongoose.connect(`mongodb://${host}:${port}/${name}`, { useNewUrlParser: true });

export const db = mongoose.connection;
