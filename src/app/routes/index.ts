import { Router } from "express";
import userRouter from "../modules/user/user.routes";
import authRouter from "../modules/auth/auth.routes";
import travelPlanRouter from "../modules/travel-plan/travelPlan.routes";

export const router = Router()

const moduleRoutes = [
    {
        path: '/user',
        route: userRouter
    },
    {
        path: '/auth',
        route: authRouter
    },
    {
        path: '/travel-plan',
        route: travelPlanRouter
    }
]


moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})
