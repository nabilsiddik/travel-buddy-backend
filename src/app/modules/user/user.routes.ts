import { Router } from "express"
import validateRequest from "../../middlewares/validateRequest"
import { UserValidation } from "./user.validation"
import { UserControllers } from "./user.controllers"
import { checkAuth } from "@/app/middlewares/checkAuth"
import { UserRole } from "@/generated/prisma/enums"
import { fileUploader } from "@/app/utils/fileUploader"

const userRouter = Router()

// Get all users 
userRouter.get('/', checkAuth(UserRole.ADMIN, UserRole.USER), UserControllers.getAllUsers)

// Get profile info
userRouter.get(
    '/profile',
    checkAuth(UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
    UserControllers.getMyProfile
)


// Ceate patient route
userRouter.post('/create-user',
     fileUploader.upload.single('file'),
     validateRequest(UserValidation.createUserSchema),
     UserControllers.createUser
)

export default userRouter