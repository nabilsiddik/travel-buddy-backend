import AppError from "@/app/errorHelpers/appError";
import { catchAsync } from "@/app/errorHelpers/catchAsync";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ParticipantServices } from "./participant.services";
import { sendResponse } from "@/app/utils/userResponse";
import { JWTPayload } from "@/app/interfaces";

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
