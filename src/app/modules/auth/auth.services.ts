import type { userLoginInput } from "./auth.interfaces"
import { UserStatus } from "../user/user.interfaces"
import bcrypt from 'bcryptjs'
import type { Secret, SignOptions } from "jsonwebtoken"
import { prisma } from "@/app/config/prisma.config"
import AppError from "@/app/errorHelpers/appError"
import { generateJwtToken, verifyToken } from "@/app/utils/jwtToken"
import { envVars } from "@/app/config/env.config"

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
        {email: existingUser?.email, role: existingUser?.role, id: existingUser.id},
        envVars.JWT.JWT_ACCESS_SECRET,
        '1h'
    )

    // Generate refresh Token
    const refreshToken = generateJwtToken(
        {email: existingUser?.email, role: existingUser?.role, id: existingUser.id},
        envVars.JWT.JWT_REFRESH_SECRET,
        '30d'
    )
    
    return {
        accessToken,
        refreshToken,
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

    const { password, ...rest } = userData;

    return rest

}


// Generate accesstoken by refreshtoken
const refreshToken = async (token: string) => {
    let decodedData;
    try {
        decodedData = verifyToken(token, envVars.JWT.JWT_REFRESH_SECRET as Secret);
    }
    catch (err) {
        throw new Error("You are not authorized!")
    }

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            status: UserStatus.ACTIVE
        }
    });

    const accessToken = generateJwtToken({
        email: userData.email,
        role: userData.role,
        id: userData.id
    },
        envVars.JWT.JWT_ACCESS_SECRET as Secret,
        envVars.JWT.JWT_ACCESS_EXPIRES as SignOptions["expiresIn"]
    );

    return {
        accessToken,
    };

};

export const AuthServices = {
    userLogin,
    getMe,
    refreshToken
}