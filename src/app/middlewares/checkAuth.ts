import type { NextFunction, Request, Response } from "express"
import type { JWTPayload } from "../interfaces/index.js"
import { verifyToken } from "../utils/jwtToken.js"
import { envVars } from "../config/env.config.js"


export const checkAuth = (...roles: string[]) => {
    return async (req: Request & { user?: JWTPayload }, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                throw new Error("Token not found");
            }

            const token = authHeader.split(" ")[1];

            console.log(token, 'my tokeeen')

            if (!token) {
                throw new Error('Token not found')
            }

            const verifiedToken = verifyToken(token, envVars.JWT.JWT_ACCESS_SECRET)

            if (!verifiedToken) {
                throw new Error('You is not authorized')
            }

            req.user = verifiedToken

            if (roles.length && !roles.includes(verifiedToken.role)) {
                throw new Error('You are not authorized')
            }

            next()

        } catch (err: unknown) {
            next(err)
        }
    }
}