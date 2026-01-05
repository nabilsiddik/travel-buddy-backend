import type { Request, Response } from "express";
import { catchAsync } from "../../errorHelpers/catchAsync.js";
import type { JWTPayload } from "../../interfaces/index.js";
import AppError from "../../errorHelpers/appError.js";
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../../utils/userResponse.js";
import { TravelPlanRequestServices } from "./travelPlanJoin.services.js";

// Get all join requests
export const getAllJoinRequests = catchAsync(
  async (req: Request, res: Response) => {
    const data = await TravelPlanRequestServices.getAllJoinRequest();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Join requests retrived successfully.",
      data,
    });
  }
);

export const sendRequest = catchAsync(
  async (req: Request & { user?: JWTPayload }, res: Response) => {
    const { planId } = req.body;
    const requesterId = req?.user?.id;

    if (!requesterId) {
      throw new AppError(StatusCodes.NOT_FOUND, "requester id not found");
    }

    const data = await TravelPlanRequestServices.sendJoinRequest(
      planId,
      requesterId
    );
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Join request sent",
      data,
    });
  }
);

export const acceptRequest = catchAsync(async (req: Request, res: Response) => {
  const { requestId } = req.body;

  const data = await TravelPlanRequestServices.acceptJoinRequest(requestId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Request accepted",
    data,
  });
});

export const rejectRequest = catchAsync(async (req: Request, res: Response) => {
  const { requestId } = req.body;

  const data = await TravelPlanRequestServices.rejectJoinRequest(requestId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Request rejected",
    data,
  });
});

export const cancelRequest = catchAsync(
  async (req: Request & { user?: JWTPayload }, res: Response) => {
    const { requestId } = req.body;
    const userId = req?.user?.id;

    if (!userId) {
      throw new AppError(StatusCodes.NOT_FOUND, "user id not found");
    }

    const data = await TravelPlanRequestServices.cancelJoinRequest(
      requestId,
      userId
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Request cancelled",
      data,
    });
  }
);

export const listPlanRequests = catchAsync(
  async (req: Request, res: Response) => {
    const { planId } = req.query;

    const data = await TravelPlanRequestServices.getPlanJoinRequests(
      planId as string
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Join requests fetched",
      data,
    });
  }
);

export const listPlanParticipants = catchAsync(
  async (req: Request, res: Response) => {
    const { planId } = req.query;

    const data = await TravelPlanRequestServices.getPlanParticipants(
      planId as string
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Participants fetched",
      data,
    });
  }
);

// Get plan requests for my plans
export const getJoinRequestsForMyPlans = catchAsync(
  async (req: Request & { user?: JWTPayload }, res: Response) => {
    const userId = req?.user?.id;

    if (!userId) {
      throw new AppError(StatusCodes.NOT_FOUND, "user id not found");
    }

    const requests = await TravelPlanRequestServices.getJoinRequestsForMyPlans(
      userId
    );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Join request retrive",
      data: requests,
    });
  }
);

// my sent request
export const getMySentRequests = catchAsync(
  async (req: Request & { user?: JWTPayload }, res: Response) => {
    const userId = req?.user?.id;

    if (!userId) {
      throw new AppError(StatusCodes.NOT_FOUND, "user id not found");
    }

    const data = await TravelPlanRequestServices.getMySentRequests(userId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "My sent join requests retrieved",
      data,
    });
  }
);

// my sent request
export const completeJoinRequest = catchAsync(
  async (req: Request & { user?: JWTPayload }, res: Response) => {
    const userId = req?.user?.id;
    const id = req.params?.id;
    const status = req.body?.status;

    if (!id) {
      throw new AppError(StatusCodes.NOT_FOUND, "id not found");
    }

    if (!userId) {
      throw new AppError(StatusCodes.NOT_FOUND, "user id not found");
    }

    const data = await TravelPlanRequestServices.completeJoinRequest(
      id,
      status,
      userId
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Join Status updated",
      data,
    });
  }
);

export const TravelPlanRequestControllers = {
  getJoinRequestsForMyPlans,
  getMySentRequests,
  completeJoinRequest,
  getAllJoinRequests,
};
