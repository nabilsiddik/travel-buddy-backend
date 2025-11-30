import { Router } from "express";
import userRouter from "../modules/user/user.routes";
import authRouter from "../modules/auth/auth.routes";

export const router = Router()

const moduleRoutes = [
    {
        path: '/user',
        route: userRouter
    },
    {
        path: '/auth/login',
        route: authRouter
    }
]


moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})
