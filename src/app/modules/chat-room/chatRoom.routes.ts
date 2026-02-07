import { Router } from "express";
import { ChatRoomControllers } from "./chatRoom.controllers.js";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { UserRole } from "../../../../generated/prisma/enums.js";

const chatRoomRouter = Router()

chatRoomRouter.get('/:tripId', checkAuth(UserRole.USER, UserRole.ADMIN), ChatRoomControllers.getChatRoom)

export default chatRoomRouter