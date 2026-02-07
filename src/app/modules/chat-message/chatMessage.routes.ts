import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { UserRole } from "../../../../generated/prisma/enums.js";
import { ChatRoomControllers } from "../chat-room/chatRoom.controllers.js";
import { ChatMessageControllers } from "./chatMessage.controllers.js";

const chatMessageRouter = Router()

chatMessageRouter.get('/:tripId', checkAuth(UserRole.USER, UserRole.ADMIN), ChatMessageControllers.getChatMessages)

export default chatMessageRouter