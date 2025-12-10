import type { Request, Response } from "express";
import { catchAsync } from "../../errorHelpers/catchAsync";
import { UserServices } from "./user.services";
import { sendResponse } from "../../utils/userResponse";
import { userFilterableFields } from "./user.constants";
import { StatusCodes } from "http-status-codes";
import { pickQueries } from "@/app/utils/pickQueries";
import { JWTPayload } from "@/app/interfaces";
import AppError from "@/app/errorHelpers/appError";

// Create user
const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.createUser(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Patient Account Created Successfully',
    data: result
  })
})


// Get all users from database
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = pickQueries(req.query, userFilterableFields)
  const options = pickQueries(req.query, ['page', 'limit', 'sortBy', 'sortOrder'])

  const result = await UserServices.getAllUsers(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All users retrived successfully.',
    data: result
  })
})


// user by id
const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await UserServices.getUserById(id);

  return res.status(200).json({
    success: true,
    message: "User fetched successfully",
    data: result,
  });
};


// Get user profile info
const getMyProfile = catchAsync(async (req: Request & { user?: JWTPayload }, res: Response) => {

  const user = req.user;

  const result = await UserServices.getMyProfile(user as JWTPayload);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "My profile data fetched!",
    data: result
  })
});


// Update user profile
export const updateUser = catchAsync(async (req: Request & { user?: JWTPayload }, res: Response) => {
  const userId = req.user?.id;

  if (!userId) throw new AppError(StatusCodes.UNAUTHORIZED, "User not found");

  const result = await UserServices.updateUser(userId, req);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User profile updated successfully",
    data: result,
  });
});

export const UserControllers = {
  createUser,
  getAllUsers,
  getMyProfile,
  updateUser,
  getUserById
}