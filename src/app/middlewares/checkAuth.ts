import type { NextFunction, Request, Response } from "express"
import type { JWTPayload } from "../interfaces/index.js"
import { verifyToken } from "../utils/jwtToken.js"
import { envVars } from "../config/env.config.js"


export const checkAuth = (...roles: string[]) => {
    return async (req: Request & { user?: JWTPayload }, res: Response, next: NextFunction) => {
        try {
            let token: string | undefined;
            const authHeader = req.headers.authorization;
            if (authHeader?.startsWith("Bearer ")) {
                token = authHeader.split(" ")[1];
            }

            if (!token && req.cookies?.accessToken) {
                token = req.cookies.accessToken;
            }

            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: "Access token not found",
                });
            }

            const verifiedToken = verifyToken(token, envVars.JWT.JWT_ACCESS_SECRET) as JWTPayload

            if (!verifiedToken) {
                throw new Error('You is not authorized')
            }

            if (roles.length && !roles.includes(verifiedToken.role)) {
                throw new Error('You are not authorized')
            }

            req.user = verifiedToken


            next()

        } catch (err: unknown) {
            next(err)
        }
    }
}