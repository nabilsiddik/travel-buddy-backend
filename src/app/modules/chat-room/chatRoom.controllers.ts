import type { Request, Response } from "express";
import { catchAsync } from "../../errorHelpers/catchAsync.js";
import type { JWTPayload } from "../../interfaces/index.js";
import { sendResponse } from "../../utils/userResponse.js";
import { ChatRoomServices } from "./chatRoom.services.js";

// Get chat room
export const getChatRoom = catchAsync(async (req: Request & { user?: JWTPayload }, res: Response) => {
    const { tripId } = req.params
    const userId = req?.user?.id

    if (!tripId) {
        throw new Error('Trip id not found')
    }

    if (!userId) {
        throw new Error('User id not found')
    }

    const result = await ChatRoomServices.getChatRoom(tripId, userId)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Join Room Fetched Successfully.",
        data: result,
    });
});


export const ChatRoomControllers = {
    getChatRoom,
}