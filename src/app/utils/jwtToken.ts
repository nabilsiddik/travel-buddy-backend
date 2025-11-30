import type { Secret, SignOptions } from "jsonwebtoken"
import type { JWTPayload } from "../app/interfaces/index.js"
import jwt from 'jsonwebtoken'

export const generateJwtToken = (payload: JWTPayload, secret: Secret, expiresIn?: SignOptions["expiresIn"]): string => {
    const options: SignOptions = {
        algorithm: 'HS256'
    }
    if(expiresIn !== undefined){
        options.expiresIn = expiresIn
    }
    const token = jwt.sign(
        payload,
        secret,
        options
    )

    return token
}

export const verifyToken = (token: string, secret: Secret) => {
    return jwt.verify(token, secret) as JWTPayload
}