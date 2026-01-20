import type { Request, Response } from "express";
import { catchAsync } from "../../errorHelpers/catchAsync.js";
import AppError from "../../errorHelpers/appError.js";
import { StatusCodes } from "http-status-codes";
import { TravelPlanServices } from "../travel-plan/travelPlan.services.js";
import { sendResponse } from "../../utils/userResponse.js";
import type { JWTPayload } from "../../interfaces/index.js";
import { TripParticipantServices } from "./tripParticipant.services.js";

// Trip Participant join request
const createTripParticipant = catchAsync(async (req: Request & {user?: JWTPayload}, res: Response) => {
  const participantId = req?.user?.id
  const {tripId} = req?.body

  console.log(tripId);

  if(!participantId) throw new AppError(StatusCodes.BAD_REQUEST, 'Please provide participant id')

  const result = await TripParticipantServices.createTripParticipant(tripId, participantId as string);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Participant request created.",
    data: result,
  });
});

// Get all my Participant join request
const myParticipantRequest = catchAsync(async (req: Request & {user?: JWTPayload}, res: Response) => {
  const userId = req?.user?.id

  if(!userId) throw new AppError(StatusCodes.UNAUTHORIZED, 'Please provide user id')

  const result = await TripParticipantServices.myParticipantRequest(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Participant requests retrived successfully.",
    data: result,
  });
});


// Get trip participant by id
const getTripParticipantById = catchAsync(async (req: Request, res: Response) => {
  const participantReqId = req?.params?.id

  console.log(participantReqId);

  if(!participantReqId) throw new AppError(StatusCodes.UNAUTHORIZED, 'Please provide participant request id')

  const result = await TripParticipantServices.getTripParticipantById(participantReqId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Participant request retrived successfully.",
    data: result,
  });
});

// Update participant request
const updateParticipantRequest = catchAsync(async (req: Request, res: Response) => {
  const participantReqId = req?.params?.id
  const {status} = req?.body

    console.log(participantReqId, status);


  if(!participantReqId || !status) throw new AppError(StatusCodes.UNAUTHORIZED, 'Please provide participant request id or status')

  const result = await TripParticipantServices.updateParticipantRequest(participantReqId, status);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Participant request updated successfully.",
    data: result,
  });
});


// Get participant for specific trip
const getParticipantsForSpecificTrip = catchAsync(async (req: Request, res: Response) => {
  const tripId = req?.params?.tripId

    console.log(tripId);


  if(!tripId) throw new AppError(StatusCodes.UNAUTHORIZED, 'Please provide trip id')

  const result = await TripParticipantServices.getParticipantsForSpecificTrip(tripId);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Participants For specific trip retrived.",
    data: result,
  });
});

export const TripParticipantControllers = {
    createTripParticipant,
    myParticipantRequest,
    getTripParticipantById,
    updateParticipantRequest,
    getParticipantsForSpecificTrip
}