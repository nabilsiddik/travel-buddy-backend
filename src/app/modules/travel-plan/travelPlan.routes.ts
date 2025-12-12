import { Router } from "express"
import { TravelPlanValidation } from "./travelPlan.validations.js"
import { checkPremium } from "../../middlewares/checkPremium.js"
import { UserRole } from "../../../../generated/prisma/enums.js"
import validateRequest from "../../middlewares/validateRequest.js"
import { checkAuth } from "../../middlewares/checkAuth.js"
import { TravelPlanControllers } from "./travelPlan.controllers.js"

const travelPlanRouter = Router()

travelPlanRouter.post(
  "/",
  checkAuth(UserRole.USER, UserRole.ADMIN),
  validateRequest(TravelPlanValidation.createTravelPlanSchema),
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