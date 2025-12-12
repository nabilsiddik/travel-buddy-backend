import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { UserRole } from "../../../../generated/prisma/enums.js";
import { ParticipantControllers } from "./participant.controllers.js";


const participantRouter = Router();


participantRouter.use(checkAuth(UserRole.ADMIN, UserRole.USER));

participantRouter.post("/complete", ParticipantControllers.completeParticipant);
participantRouter.get("/my-participants", ParticipantControllers.getHostParticipants);

export default participantRouter;
