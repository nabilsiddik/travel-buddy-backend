import { prisma } from "src/app/config/prisma.config"
import type { userLoginInput } from "./auth.interfaces"
import { UserStatus } from "../user/user.interfaces"
import bcrypt from 'bcryptjs'
import AppError from "src/app/errorHelpers/appError"
import { generateJwtToken, verifyToken } from "src/app/utils/jwtToken"
import { envVars } from "src/app/config/env.config"
import type { Secret } from "jsonwebtoken"

// User login
const userLogin = async (payload: userLoginInput) => {
    const existingUser = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload?.email,
            status: UserStatus.ACTIVE
        }
    })

    const isPasswordMatch = await bcrypt.compare(payload?.password, existingUser?.password)

    if (!isPasswordMatch) {
        throw new AppError(400, 'Password is incorrect')
    }

    // Generate access Token
    const accessToken = generateJwtToken(
        {email: existingUser?.email, role: existingUser?.role},
        envVars.JWT.JWT_ACCESS_SECRET,
        '1h'
    )

    // Generate refresh Token
    const refreshToken = generateJwtToken(
        {email: existingUser?.email, role: existingUser?.role},
        envVars.JWT.JWT_REFRESH_SECRET,
        '30d'
    )
    
    return {
        accessToken,
        refreshToken,
        needPasswordChange: existingUser?.needPasswordChange
    }
}

// Get current loged in user
const getMe = async (session: any) => {
    const accessToken = session.accessToken;
    
    const decodedData = verifyToken(accessToken, envVars.JWT.JWT_ACCESS_SECRET as Secret);

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            status: UserStatus.ACTIVE
        }
    })

    const { id, email, role, needPasswordChange, status } = userData;

    return {
        id,
        email,
        role,
        needPasswordChange,
        status
    }

}


export const AuthServices = {
    userLogin,
    getMe
}