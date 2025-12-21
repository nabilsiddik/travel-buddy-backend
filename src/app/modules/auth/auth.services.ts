import bcrypt from "bcryptjs";
import type { Secret, SignOptions } from "jsonwebtoken";
import { prisma } from "../../config/prisma.config.js";
import type { userLoginInput } from "./auth.interfaces.js";
import { UserStatus } from "../../../../generated/prisma/enums.js";
import AppError from "../../errorHelpers/appError.js";
import { generateJwtToken, verifyToken } from "../../utils/jwtToken.js";
import { envVars } from "../../config/env.config.js";
import { StatusCodes } from "http-status-codes";
// User login
const userLogin = async (payload: userLoginInput) => {
  const existingUser = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload?.email,
    },
  });

  if (existingUser?.status === "DELETED") {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Sorry this account is Deleted"
    );
  }

  const isPasswordMatch = await bcrypt.compare(
    payload?.password,
    existingUser?.password
  );

  if (!isPasswordMatch) {
    throw new AppError(400, "Password is incorrect");
  }

  // Generate access Token
  const accessToken = generateJwtToken(
    {
      email: existingUser?.email,
      role: existingUser?.role,
      id: existingUser.id,
      verifiedBadge: existingUser?.verifiedBadge || false,
    },
    envVars.JWT.JWT_ACCESS_SECRET,
    envVars.JWT.JWT_ACCESS_EXPIRES as SignOptions["expiresIn"]
  );

  // Generate refresh Token
  const refreshToken = generateJwtToken(
    {
      email: existingUser?.email,
      role: existingUser?.role,
      id: existingUser.id,
      verifiedBadge: existingUser?.verifiedBadge || false,
    },
    envVars.JWT.JWT_REFRESH_SECRET,
    "30d"
  );

  return {
    accessToken,
    refreshToken,
  };
};

// Get current loged in user
const getMe = async (session: any) => {
  const accessToken = session.accessToken;

  const decodedData = verifyToken(
    accessToken,
    envVars.JWT.JWT_ACCESS_SECRET as Secret
  );

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
      status: UserStatus.ACTIVE,
    },
  });

  const { password, ...rest } = userData;

  return rest;
};

// Generate accesstoken by refreshtoken
const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = verifyToken(token, envVars.JWT.JWT_REFRESH_SECRET as Secret);
  } catch (err) {
    throw new Error("You are not authorized!");
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
      status: UserStatus.ACTIVE,
    },
  });

  const accessToken = generateJwtToken(
    {
      email: userData.email,
      role: userData.role,
      id: userData.id,
      verifiedBadge: userData?.verifiedBadge || false,
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
  refreshToken,
};
