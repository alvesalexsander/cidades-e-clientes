const expressJwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const jwtMiddleware = expressJwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.JWT_MIDDLEWARE_JWKSURI
  }),

  // Validate the audience and the issuer.
  audience: process.env.JWT_MIDDLEWARE_AUDIENCE,
  issuer: process.env.JWT_MIDDLEWARE_ISSUER,
  algorithms: ['RS256']
});

module.exports = { jwtMiddleware };