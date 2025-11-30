import type { Request, Response } from "express";
import { catchAsync } from "../../errorHelpers/catchAsync";
import { UserServices } from "./user.services";
import { sendResponse } from "../../utils/userResponse";
import { pickQueries } from "src/app/utils/pickQueries";
import { userFilterableFields } from "./user.constants";
import type { JWTPayload } from "src/app/interfaces";
import { StatusCodes } from "http-status-codes";

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
  const filters =  pickQueries(req.query, userFilterableFields)
  const options =  pickQueries(req.query, ['page', 'limit', 'sortBy', 'sortOrder'])

  const result = await UserServices.getAllUsers(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All users retrived successfully.',
    data: result
  })
})


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

export const UserControllers = {
    createUser,
    getAllUsers,
    getMyProfile
}