import { Router } from "express";

import { checkAuth } from "../../middlewares/checkAuth.js";
import { UserRole } from "../../../../generated/prisma/enums.js";
import {
  acceptRequest,
  cancelRequest,
  listPlanParticipants,
  listPlanRequests,
  rejectRequest,
  sendRequest,
  TravelPlanRequestControllers,
} from "./travelPlanJoin.controllers.js";

const joinRequestRouter = Router();

joinRequestRouter.use(checkAuth(UserRole.ADMIN, UserRole.USER));

joinRequestRouter.post("/send", sendRequest);
joinRequestRouter.post("/accept", acceptRequest);
joinRequestRouter.post("/reject", rejectRequest);
joinRequestRouter.post("/cancel", cancelRequest);

joinRequestRouter.get("/", TravelPlanRequestControllers.getAllJoinRequests);

joinRequestRouter.get(
  "/my-request",
  TravelPlanRequestControllers.getJoinRequestsForMyPlans
);
joinRequestRouter.patch(
  "/complete/:id",
  TravelPlanRequestControllers.completeJoinRequest
);

joinRequestRouter.get("/requests", listPlanRequests);
joinRequestRouter.get("/participants", listPlanParticipants);

joinRequestRouter.get(
  "/my-sent",
  TravelPlanRequestControllers.getMySentRequests
);

export default joinRequestRouter;
