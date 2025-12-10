import { Router } from "express"
import { TravelPlanValidation } from "./travelPlan.validations"
import { TravelPlanControllers } from "./travelPlan.controllers"
import { UserRole } from "@/generated/prisma/enums"
import { checkAuth } from "@/app/middlewares/checkAuth"
import validateRequest from "@/app/middlewares/validateRequest"
import { checkPremium } from "@/app/middlewares/checkPremium"

const travelPlanRouter = Router()

travelPlanRouter.post(
  "/",
  checkAuth(UserRole.USER, UserRole.ADMIN),
  validateRequest(TravelPlanValidation.createTravelPlanSchema),
  checkPremium,
  TravelPlanControllers.createTravelPlan
)

travelPlanRouter.get(
  "/",
  checkAuth(UserRole.USER, UserRole.ADMIN),
  TravelPlanControllers.getAllTravelPlans
)


travelPlanRouter.get(
  "/my-plans",
  checkAuth(UserRole.USER, UserRole.ADMIN),
  checkPremium,
  TravelPlanControllers.getMyTravelPlans
)


travelPlanRouter.get(
  "/:id",
  checkAuth(UserRole.USER, UserRole.ADMIN),
  TravelPlanControllers.getTravelPlanById
);



travelPlanRouter.patch(
  "/:id",
  checkAuth(UserRole.USER, UserRole.ADMIN),
  validateRequest(TravelPlanValidation.updateTravelPlanSchema),
  TravelPlanControllers.updateTravelPlan
)

travelPlanRouter.delete(
  "/:id",
  checkAuth(UserRole.USER, UserRole.ADMIN),
  TravelPlanControllers.deleteTravelPlan
)

export default travelPlanRouter