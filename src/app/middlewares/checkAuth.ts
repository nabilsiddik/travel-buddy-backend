import type { NextFunction, Request, Response } from "express"
import { JWTPayload } from "../interfaces"
import { envVars } from "../config/env.config"
import { verifyToken } from "../utils/jwtToken"


export const checkAuth = (...roles: string[]) => {
    return async (req: Request & {user?: JWTPayload}, res: Response, next: NextFunction) => {
        try {
            const token = req.cookies.accessToken

            if (!token) {
                throw new Error('Token not found')
            }

            const verifiedToken = verifyToken(token, envVars.JWT.JWT_ACCESS_SECRET)

            if (!verifiedToken) {
                throw new Error('You is not authorized')
            }

            req.user = verifiedToken

            if(roles.length && !roles.includes(verifiedToken.role)){
                throw new Error('You are not authorized')
            }

            next()

        }catch(err: unknown){
            next(err)
        }
    }
}