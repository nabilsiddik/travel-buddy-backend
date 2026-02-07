import { Server } from 'socket.io'
import { registerChatHandlers } from './chat.socket.js'

let io: Server
export const initSocket = (server: any) => {
    io = new Server(server, {
        cors: {
            origin: ['http://localhost:3000', 'https://travel-buddy-frontend-six.vercel.app'],
            credentials: true,
            methods: ['GET', 'POST'],
        },
    })


    console.log('Socket.IO initialized')

    io.on('connection', (socket) => {
        console.log('User is connected', socket.id);

        registerChatHandlers(io, socket)

        io.on('disconnect', (socket) => {
            console.log('User is disconnected', socket.id);
        })
    })

    return io
}