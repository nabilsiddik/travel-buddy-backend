import { Router } from "express";
import { ReviewControllers } from "./review.controllers";
import { checkAuth } from "@/app/middlewares/checkAuth";
import { UserRole } from "@/generated/prisma/enums";

const reviewRouter = Router()

reviewRouter.get("/reviewable-plans", checkAuth(UserRole.ADMIN, UserRole.USER), ReviewControllers.getReviewablePlans);

reviewRouter.post("/", checkAuth(UserRole.ADMIN, UserRole.USER), ReviewControllers.createPlanReview);


export default reviewRouter