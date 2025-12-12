
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../errorHelpers/catchAsync.js";
import type { JWTPayload } from "../../interfaces/index.js";
import type { Request, Response } from "express";
import AppError from "../../errorHelpers/appError.js";
import { ReviewServices } from "./review.services.js";
import { sendResponse } from "../../utils/userResponse.js";


// Create review
export const createPlanReview = catchAsync(async (req: Request & { user?: JWTPayload }, res: Response) => {
    const { targetUserId, planId, rating, comment } = req.body;

    console.log({ targetUserId, planId, rating, comment })

    const reviewerId = req?.user?.id;

    if (!reviewerId) {
        throw new AppError(StatusCodes.NOT_FOUND, 'requester id not found')
    }

    const data = await ReviewServices.createReview(reviewerId, targetUserId, planId, rating, comment);

    sendResponse(res, { statusCode: 201, success: true, message: "Review created", data });
});


// get reviewable plans
export const getReviewablePlans = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const userId = req.user.id;
  const data = await ReviewServices.getReviewablePlans(userId);

  sendResponse(res, { statusCode: 200, success: true, message: "Reviewable plans fetched", data });
});

export const ReviewControllers = {
    createPlanReview,
    getReviewablePlans
}
