import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { UserRole } from "../../../../generated/prisma/enums.js";
import { UserControllers } from "./user.controllers.js";
import { fileUploader } from "../../utils/fileUploader.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { UserValidation } from "./user.validation.js";
import { catchAsync } from "../../errorHelpers/catchAsync.js";

const userRouter = Router();

// Get all users
userRouter.get(
  "/",
  checkAuth(UserRole.ADMIN, UserRole.USER),
  UserControllers.getAllUsers
);

// Get profile info
userRouter.get(
  "/profile",
  checkAuth(UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  UserControllers.getMyProfile
);

// Get top rated travelers
userRouter.get("/top-rated", UserControllers.topRatedUsers);

// Get all travelers
userRouter.get("/travelers", UserControllers.getAllTravelers);

// Get matched travelers
userRouter.get(
  "/travelers/matched-travelers",
  checkAuth(UserRole.ADMIN, UserRole.USER),
  UserControllers.getMatchedTravelers
);

// Ceate user route
userRouter.post(
  "/create-user",
  fileUploader.upload.single("file"),
  validateRequest(UserValidation.createUserSchema),
  UserControllers.createUser
);

// Update user
userRouter.patch(
  "/update-user",
  checkAuth(UserRole.ADMIN, UserRole.USER),
  fileUploader.upload.single("file"),
  validateRequest(UserValidation.updateUserZodSchema),
  UserControllers.updateUser
);

userRouter.get("/:userId/reviews", UserControllers.getUserReviewsWithAvgRating);

userRouter.get("/:id", UserControllers.getUserById);

userRouter.delete(
  "/",
  checkAuth(UserRole.ADMIN),
  catchAsync(UserControllers.deleteUser)
);

export default userRouter;
