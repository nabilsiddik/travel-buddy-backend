import { StatusCodes } from "http-status-codes"
import { prisma } from "../../config/prisma.config.js"
import AppError from "../../errorHelpers/appError.js"
import type { Request, Response } from "express"
import type { JWTPayload } from "../../interfaces/index.js"

// check if the user can access chat room
export const canAccessChatRoom = async (tripId: string, userId: string) => {
  const participant = await prisma.tripParticipant.findFirst({
    where: {
      tripId,
      userId,
      status: 'APPROVED',
    },
  })

  if (!participant) {
    throw new AppError(StatusCodes.FORBIDDEN, 'You are not allowed to access this chat room')
  }

  return true
}


// Get chat room
export const getChatRoom = async (tripId: string, userId: string) => {

  await canAccessChatRoom(tripId, userId)

  let room = await prisma.chatRoom.findUnique({
    where: { tripId },
  })

  if (!room) {
    room = await prisma.chatRoom.create({
      data: { tripId },
    })
  }

  return room
}


export const ChatRoomServices = {
    getChatRoom,
}