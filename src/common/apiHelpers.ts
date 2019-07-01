import express = require("express");
import jwt_decode from "jwt-decode";
import { IProfilePayload } from "../models/auth/IProfilePayload";

export const apiHelpers = {
	getProfilePayload: (req: express.Request): IProfilePayload | undefined => {
		const token = req && req.headers && req.headers.authorization;

		if (token) {
			return jwt_decode(token);
		}
		return undefined;
	}
}