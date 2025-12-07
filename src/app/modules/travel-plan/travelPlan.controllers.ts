import { catchAsync } from "@/app/errorHelpers/catchAsync";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { TravelPlanServices } from "./travelPlan.services";
import { sendResponse } from "@/app/utils/userResponse";
import { pickQueries } from "@/app/utils/pickQueries";
import { JWTPayload } from "@/app/interfaces";
import AppError from "@/app/errorHelpers/appError";

// Create plan
const createTravelPlan = catchAsync(async (req: Request, res: Response) => {
    const result = await TravelPlanServices.createTravelPlan(req)

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Travel plan created successfully.",
        data: result
    })
})


// Get all plans
const getAllTravelPlans = catchAsync(async (req, res) => {
    const filters = pickQueries(req.query, ["destination", "travelType", "visibility"]);
    const options = pickQueries(req.query, ["page", "limit", "sortBy", "sortOrder"])

    const result = await TravelPlanServices.getAllTravelPlans(filters, options)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Travel plans fetched successfully.",
        data: result
    })
})

// Get travel plan by id
const getTravelPlanById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await TravelPlanServices.getTravelPlanById(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Travel plan fetched successfully.",
    data: result,
  });
});


// Get my plans
const getMyTravelPlans = catchAsync(async (req: Request & { user?: JWTPayload }, res: Response) => {
    const user = req?.user;

    if (!user) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'User not found')
    }

    const result = await TravelPlanServices.getMyTravelPlans(user as JWTPayload);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "My travel plans fetched successfully.",
        data: result
    })
})



// Update plan
const updateTravelPlan = catchAsync(async (req: Request & { user?: JWTPayload }, res: Response) => {
    const user = req?.user
    const id = req.params?.id

    if (!user) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'User not found')
    }

    if (!id) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Travel id not found')
    }

    const payload = req.body;

    const result = await TravelPlanServices.updateTravelPlan(id, user, payload)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Travel plan updated successfully.",
        data: result
    })
})




// Delete plan
const deleteTravelPlan = catchAsync(async (req: Request & { user?: JWTPayload }, res: Response) => {
    const user = req.user
    const id = req.params.id

    if (!user) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'User not found')
    }

    if (!id) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Travel id not found')
    }

    const result = await TravelPlanServices.deleteTravelPlan(id, user)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Travel plan deleted successfully.",
        data: result
    })
})

export const TravelPlanControllers = {
  createTravelPlan,
  getAllTravelPlans,
  getMyTravelPlans,
  updateTravelPlan,
  deleteTravelPlan,
  getTravelPlanById
}