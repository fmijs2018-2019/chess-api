
export interface IProfilePayload extends IProfile {
	//claims
	sub?: string;
	iss?: string;
	aud?: string;
	exp?: number;
	iat?: number;
}

export interface IProfile {
	given_name?: string;
	family_name?: string;
	name?: string;
	email?: string;
	picture?: string;
}
