import { Router } from "express";
import authRouter from "../modules/auth/auth.routes";
import travelPlanRouter from "../modules/travel-plan/travelPlan.routes";
import userRouter from "../modules/user/user.routes";
import subscriptionRouter from "../modules/subscription/subscription.routes";
import joinRequestRouter from "../modules/travelPlan-join/travelPlanJoin.routes";
import reviewRouter from "../modules/review/review.routes";
import participantRouter from "../modules/travelParticipant/participant.router";


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
    },
    {
        path: '/subscription',
        route: subscriptionRouter
    },
    {
        path: '/join-request',
        route: joinRequestRouter
    },
    {
        path: '/review',
        route: reviewRouter
    },
    {
        path: '/participant',
        route: participantRouter
    }
]


moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})
