
export interface IProfilePayload {
	given_name?: string;
	family_name?: string;
	name?: string;
	email?: string;
	picture?: string;
	//claims
	sub?: string;
	iss?: string;
	aud?: string;
	exp?: number;
	iat?: number;
}