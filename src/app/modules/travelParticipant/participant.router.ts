import { checkAuth } from "@/app/middlewares/checkAuth";
import { UserRole } from "@/generated/prisma/enums";
import { Router } from "express";
import { ParticipantControllers } from "./participant.controllers";

const participantRouter = Router();


participantRouter.use(checkAuth(UserRole.ADMIN, UserRole.USER));

participantRouter.post("/complete", ParticipantControllers.completeParticipant);
participantRouter.get("/my-participants", ParticipantControllers.getHostParticipants);

export default participantRouter;
