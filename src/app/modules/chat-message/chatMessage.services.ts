import { StatusCodes } from "http-status-codes"
import { prisma } from "../../config/prisma.config.js"
import AppError from "../../errorHelpers/appError.js"

// Get chat messages
const getChatMessagesForSpecificRoom = async(tripId: string) => {

    const room = await prisma.chatRoom.findUnique({
        where: {
            tripId
        }
    })

    if(!room) throw new AppError(StatusCodes.NOT_FOUND, 'Room not found')

    const result = await prisma.chatMessage.findMany({
        where: {
            roomId: room?.id
        }
    })
    return result || []
}

export const ChatMessagServices = {
    getChatMessagesForSpecificRoom
}