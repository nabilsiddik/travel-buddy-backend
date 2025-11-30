import { Router } from "express"
import validateRequest from "../../middlewares/validateRequest"
import { UserValidation } from "./user.validation"
import { UserControllers } from "./user.controllers"
import { checkAuth } from "src/app/middlewares/checkAuth"
import { UserRole } from "src/generated/prisma/enums"

const userRouter = Router()

// Get all users 
userRouter.get('/', checkAuth(UserRole.ADMIN), UserControllers.getAllUsers)

// Get profile info
userRouter.get(
    '/profile',
    checkAuth(UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
    UserControllers.getMyProfile
)


// Ceate patient route
userRouter.post('/create-user',
     validateRequest(UserValidation.createUserValidationSchema),
     UserControllers.createUser
)

export default userRouter