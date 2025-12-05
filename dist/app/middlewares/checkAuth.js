import { verifyToken } from "../utils/jwtToken.js";
import { envVars } from "../config/env.config.js";
export const checkAuth = (...roles) => {
    return async (req, res, next) => {
        try {
            const token = req.cookies.accessToken;
            if (!token) {
                throw new Error('Token not found');
            }
            const verifiedToken = verifyToken(token, envVars.JWT.JWT_ACCESS_SECRET);
            if (!verifiedToken) {
                throw new Error('You is not authorized');
            }
            req.user = verifiedToken;
            if (roles.length && !roles.includes(verifiedToken.role)) {
                throw new Error('You are not authorized');
            }
            next();
        }
        catch (err) {
            next(err);
        }
    };
};
//# sourceMappingURL=checkAuth.js.map