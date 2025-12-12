import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { UserRole } from "../../../../generated/prisma/enums.js";
import { ReviewControllers } from "./review.controllers.js";

const reviewRouter = Router()

reviewRouter.get("/reviewable-plans", checkAuth(UserRole.ADMIN, UserRole.USER), ReviewControllers.getReviewablePlans);

reviewRouter.post("/", checkAuth(UserRole.ADMIN, UserRole.USER), ReviewControllers.createPlanReview);


export default reviewRouter