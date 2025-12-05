import { Router } from "express";
import { checkAuth } from "src/app/middlewares/checkAuth";
import validateRequest from "src/app/middlewares/validateRequest";
import { UserRole } from "src/generated/prisma/enums";
import { TravelPlanValidation } from "./travelPlan.validations";
import { TravelPlanControllers } from "./travelPlan.controllers";
const travelPlanRouter = Router();
travelPlanRouter.post("/", checkAuth(UserRole.USER, UserRole.ADMIN), validateRequest(TravelPlanValidation.createTravelPlanSchema), TravelPlanControllers.createTravelPlan);
travelPlanRouter.get("/", checkAuth(UserRole.USER, UserRole.ADMIN), TravelPlanControllers.getAllTravelPlans);
travelPlanRouter.get("/my-plans", checkAuth(UserRole.USER, UserRole.ADMIN), TravelPlanControllers.getMyTravelPlans);
travelPlanRouter.patch("/:id", checkAuth(UserRole.USER, UserRole.ADMIN), validateRequest(TravelPlanValidation.updateTravelPlanSchema), TravelPlanControllers.updateTravelPlan);
travelPlanRouter.delete("/:id", checkAuth(UserRole.USER, UserRole.ADMIN), TravelPlanControllers.deleteTravelPlan);
export default travelPlanRouter;
//# sourceMappingURL=travelPlan.routes.js.map