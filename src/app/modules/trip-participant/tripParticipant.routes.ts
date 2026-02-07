import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { UserRole } from "../../../../generated/prisma/enums.js";
import { TripParticipantControllers } from "./tripParticipant.controllers.js";

const tripParticipantRouter = Router();

// Create trip participant
tripParticipantRouter.post(
  "/",
  checkAuth(UserRole.ADMIN, UserRole.USER),
  TripParticipantControllers.createTripParticipant
);

// Get all approved participation of an user for join room conversation
tripParticipantRouter.get(
  "/joined",
  checkAuth(UserRole.USER),
  TripParticipantControllers.getAllParticipationsOfAnUser
);

// Get trip participant by id
tripParticipantRouter.get(
  "/:id",
  checkAuth(UserRole.ADMIN, UserRole.USER),
  TripParticipantControllers.getTripParticipantById
);

// Get user participation
tripParticipantRouter.get(
  "/participation-status/:tripId",
  checkAuth(UserRole.ADMIN, UserRole.USER),
  TripParticipantControllers.getUserParticipationForTrip
);

// Update participant request
tripParticipantRouter.patch(
  "/:id",
  checkAuth(UserRole.ADMIN, UserRole.USER),
  TripParticipantControllers.updateParticipantRequest
);

// Update participant request
tripParticipantRouter.get(
  "/participants/:tripId",
  TripParticipantControllers.getParticipantsForSpecificTrip
);




export default tripParticipantRouter;
