import jwt from 'jsonwebtoken';
export const generateJwtToken = (payload, secret, expiresIn) => {
    const options = {
        algorithm: 'HS256'
    };
    if (expiresIn !== undefined) {
        options.expiresIn = expiresIn;
    }
    const token = jwt.sign(payload, secret, options);
    return token;
};
export const verifyToken = (token, secret) => {
    return jwt.verify(token, secret);
};
//# sourceMappingURL=jwtToken.js.map