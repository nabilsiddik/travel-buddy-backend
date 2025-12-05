import type { Request, Response } from "express";
import { AuthServices } from "./auth.services";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "@/app/errorHelpers/catchAsync";
import { sendResponse } from "@/app/utils/userResponse";

// User login
const userLogin = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.userLogin(req.body);
  const { accessToken, refreshToken } = result

  res.cookie("accessToken", accessToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24
  });

  res.cookie('refreshToken', refreshToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 90
  })

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User Loged in Successfully',
    data: {
      accessToken,
      refreshToken,
    }
  })
})

// Get logedin user info
const getMe = catchAsync(async (req: Request, res: Response) => {
  const userSession = req.cookies;

  const result = await AuthServices.getMe(userSession);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User retrive successfully!",
    data: result,
  });
});



export const AuthControllers = {
  userLogin,
  getMe
}