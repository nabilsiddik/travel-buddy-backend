import { checkAuth } from "@/app/middlewares/checkAuth";
import { UserRole } from "@/generated/prisma/enums";
import { Router } from "express";
import { acceptRequest, cancelRequest, createPlanReview, listPlanParticipants, listPlanRequests, rejectRequest, sendRequest, TravelPlanRequestControllers } from "./travelPlanJoin.controllers";


const joinRequestRouter = Router();

joinRequestRouter.use(checkAuth(UserRole.ADMIN, UserRole.USER));

joinRequestRouter.post("/send", sendRequest);
joinRequestRouter.post("/accept", acceptRequest);
joinRequestRouter.post("/reject", rejectRequest);
joinRequestRouter.post("/cancel", cancelRequest);

joinRequestRouter.get("/my-request", TravelPlanRequestControllers.getJoinRequestsForMyPlans);

joinRequestRouter.get("/requests", listPlanRequests);
joinRequestRouter.get("/participants", listPlanParticipants);


joinRequestRouter.post("/review", createPlanReview);

export default joinRequestRouter;
