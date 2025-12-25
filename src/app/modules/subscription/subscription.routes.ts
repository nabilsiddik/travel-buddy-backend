import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { UserRole } from "../../../../generated/prisma/enums.js";
import { SubscriptionControllers } from "./subscription.controllers.js";

const subscriptionRouter = Router();

subscriptionRouter.post(
  "/create-session",
  checkAuth(UserRole.ADMIN, UserRole.USER),
  SubscriptionControllers.createSubscriptionSession
);

subscriptionRouter.get(
  "/verify-session",
  SubscriptionControllers.verifySession
);

export default subscriptionRouter;
