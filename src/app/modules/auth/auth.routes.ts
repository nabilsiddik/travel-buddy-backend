import { Router } from "express"
import { AuthControllers } from "./auth.controllers"

const authRouter = Router()

// Get loged in user route
authRouter.get(
    "/me",
    AuthControllers.getMe
)

// User login route
authRouter.post('/login', AuthControllers.userLogin)

export default authRouter 