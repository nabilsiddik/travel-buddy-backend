import AppError from "@/app/errorHelpers/appError";
import { catchAsync } from "@/app/errorHelpers/catchAsync";
import { JWTPayload } from "@/app/interfaces";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ReviewServices } from "./review.services";
import { sendResponse } from "@/app/utils/userResponse";

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
