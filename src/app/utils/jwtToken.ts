import type { Secret, SignOptions } from "jsonwebtoken"
import jwt from 'jsonwebtoken'
import type { JWTPayload } from "../interfaces"

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