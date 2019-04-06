import { IError } from './error';

export interface IApiResult<T> {
	isSuccess: boolean,
	data?: T,
	error?: IError
}