import { Router } from "express";
import { SubscriptionControllers } from "./subscription.controllers";
import { checkAuth } from "@/app/middlewares/checkAuth";
import { UserRole } from "@/generated/prisma/enums";

const subscriptionRouter = Router()

subscriptionRouter.post('/create-session', checkAuth(UserRole.ADMIN, UserRole.USER), SubscriptionControllers.createSubscriptionSession)

subscriptionRouter.get('/verify-session', SubscriptionControllers.verifySession)

export default subscriptionRouter