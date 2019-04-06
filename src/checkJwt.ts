import jwt from 'express-jwt';
const jwksRsa = require('jwks-rsa');

export const checkJwt = jwt({
	secret: jwksRsa.expressJwtSecret({
		cache: true,
		rateLimit: true,
		jwksRequestsPerMinute: 5,
		jwksUri: `https://${process.env.DOMAIN}/.well-known/jwks.json`
	}),

	audience: process.env.SPACLIENTID,
	issuer: `https://${process.env.DOMAIN}/`,
	algorithms: ['RS256']
});
