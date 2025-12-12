import type { Request, Response } from "express";
import { catchAsync } from "../../errorHelpers/catchAsync.js";
import type { JWTPayload } from "../../interfaces/index.js";
import AppError from "../../errorHelpers/appError.js";
import { StatusCodes } from "http-status-codes";
import { ParticipantServices } from "./participant.services.js";
import { sendResponse } from "../../utils/userResponse.js";


export const completeParticipant = catchAsync(async (req: Request & {user?: JWTPayload}, res: Response) => {
  const { participantId } = req.body;

  console.log(participantId, 'hellluuuuu')

  const userId = req?.user?.id;

  if (!userId) {
    throw new AppError(StatusCodes.NOT_FOUND, 'user id not found')
  }

  if (!participantId) {
    throw new AppError(StatusCodes.NOT_FOUND, 'participant id not found')
  }


  const participant = await ParticipantServices.markParticipantComplete(participantId, userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Participant marked as completed",
    data: participant,
  });
});


export const getHostParticipants = catchAsync(async (req: Request & { user?: JWTPayload }, res: Response) => {
  const hostId = req.user?.id;

  if(!hostId){
    throw new AppError(StatusCodes.NOT_FOUND, 'Host id not found.')
  }

  const data = await ParticipantServices.getHostParticipants(hostId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Participants retrieved successfully",
    data,
  });
});

export const ParticipantControllers = {
    completeParticipant,
    getHostParticipants
}
