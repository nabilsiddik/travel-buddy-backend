import type { Server, Socket } from "socket.io";
import { prisma } from "../config/prisma.config.js";
import { connect } from "http2";

export const registerChatHandlers = (io: Server, socket: Socket) => {
    // join room 
    socket.on('join-room', async ({ tripId, userId }) => {
        socket.join(tripId)

        socket.to(tripId).emit('user-joined', {
            userId
        })
    })

    // send message 
    socket.on('send-message', async ({ tripId, senderId, content }) => {

        const room = await prisma.chatRoom.findUnique({
            where: { tripId }
        });

        if (!room) return console.log("Room not found");

        const message = await prisma.chatMessage.create({
            data: {
                content,
                senderId,
                roomId: room?.id
            },
            include: {
                sender: true
            }
        })

        io.to(tripId).emit('new-message', message)
    })

    // Typing message
    socket.on('typing', ({ tripId, userName }) => {
        socket.to(tripId).emit('user-typing', userName)
    })

    socket.on('stop-typing', ({ tripId, userName }) => {
        socket.to(tripId).emit('user-stop-typing', userName)
    })
}