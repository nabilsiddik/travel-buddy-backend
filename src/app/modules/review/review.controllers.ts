import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../errorHelpers/catchAsync.js";
import type { JWTPayload } from "../../interfaces/index.js";
import type { Request, Response } from "express";
import AppError from "../../errorHelpers/appError.js";
import { ReviewServices } from "./review.services.js";
import { sendResponse } from "../../utils/userResponse.js";

// Get all reviews
export const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const data = await ReviewServices.getAllReviews();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All reviews retrived.",
    data,
  });
});

// Create review
export const createPlanReview = catchAsync(
  async (req: Request & { user?: JWTPayload }, res: Response) => {
    const { targetUserId, planId, rating, comment } = req.body;

    const reviewerId = req?.user?.id;

    if (!reviewerId) {
      throw new AppError(StatusCodes.NOT_FOUND, "requester id not found");
    }

    const data = await ReviewServices.createReview(
      reviewerId,
      targetUserId,
      planId,
      rating,
      comment
    );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Review created",
      data,
    });
  }
);

// get reviewable plans
export const getReviewablePlans = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const userId = req.user.id;
    const data = await ReviewServices.getReviewablePlans(userId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Reviewable plans fetched",
      data,
    });
  }
);

// update review
export const updateReview = catchAsync(
  async (req: Request & { user?: JWTPayload }, res: Response) => {
    const { id } = req.params;
    const { comment, rating } = req.body;
    const user = req.user;

    if (!id) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Review id not provided.");
    }

    const data = await ReviewServices.updateReview(user as JWTPayload, id, {
      comment,
      rating,
    });

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Review Updated",
      data,
    });
  }
);

// delete review
export const deleteReview = catchAsync(
  async (req: Request & { user?: JWTPayload }, res: Response) => {
    const { id } = req.params;
    const user = req.user;

    if (!id) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Review id not provided.");
    }

    const data = await ReviewServices.deleteReview(user as JWTPayload, id);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Review deleted",
      data,
    });
  }
);

export const ReviewControllers = {
  createPlanReview,
  getReviewablePlans,
  updateReview,
  deleteReview,
  getAllReviews,
};
