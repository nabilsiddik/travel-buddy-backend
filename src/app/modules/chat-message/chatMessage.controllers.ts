import type { Request, Response } from "express";
import { catchAsync } from "../../errorHelpers/catchAsync.js";
import { sendResponse } from "../../utils/userResponse.js";
import { ChatMessagServices } from "./chatMessage.services.js";
import AppError from "../../errorHelpers/appError.js";
import { StatusCodes } from "http-status-codes";

// Get chat messages
export const getChatMessages = catchAsync(async (req: Request, res: Response) => {
    const {tripId} = req.params
    if(!tripId) throw new AppError(StatusCodes.NOT_FOUND, 'trip id not found')
    const result = await ChatMessagServices.getChatMessagesForSpecificRoom(tripId)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Join Room Fetched Successfully.",
        data: result,
    });
});


export const ChatMessageControllers = {
   getChatMessages
};