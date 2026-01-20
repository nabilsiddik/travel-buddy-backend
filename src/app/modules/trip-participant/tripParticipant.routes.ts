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

// Get all my Participant join request
tripParticipantRouter.get(
  "/",
  checkAuth(UserRole.ADMIN, UserRole.USER),
  TripParticipantControllers.myParticipantRequest
);

// Get trip participant by id
tripParticipantRouter.get(
  "/:id",
  checkAuth(UserRole.ADMIN, UserRole.USER),
  TripParticipantControllers.getTripParticipantById
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
