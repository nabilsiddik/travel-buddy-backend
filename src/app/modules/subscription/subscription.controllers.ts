import AppError from '@/app/errorHelpers/appError';
import { StatusCodes } from 'http-status-codes';
import { stripe, SubscriptionServices } from './subscription.services';
import { sendResponse } from '@/app/utils/userResponse';
import { catchAsync } from '@/app/errorHelpers/catchAsync';
import { JWTPayload } from '@/app/interfaces';
import { Request, Response } from 'express';
import { prisma } from '@/app/config/prisma.config';
import Stripe from 'stripe';
import { envVars } from '@/app/config/env.config';


// Get user profile info and create a subscription session
const createSubscriptionSession = catchAsync(async (req: Request & { user?: JWTPayload }, res: Response) => {
    const userId = req?.user?.id;
    const { plan } = req.body;

    if (!userId) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'User id not found');
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId, status: 'ACTIVE' },
            include: { subscription: true }
        });

        if (!user) {
            throw new AppError(StatusCodes.UNAUTHORIZED, 'User not found');
        }

        let customerId = user.subscription?.stripeCustomerId;

        if (!customerId) {
            customerId = await SubscriptionServices.createStripeCustomer(user.email);

            try {
                await prisma.subscription.create({
                    data: {
                        userId,
                        stripeCustomerId: customerId,
                        status: 'incomplete',
                        plan,
                        stripeSubscriptionId: '',
                        currentPeriodEnd: new Date(),
                    },
                });
            } catch (err: any) {
                if (err.code === 'P2002') {
                    console.error('Unique constraint violation:', err.meta);
                    throw new AppError(StatusCodes.BAD_REQUEST, 'Subscription already exists for this user');
                }
                throw err;
            }
        } else {
            console.log("User already has a subscription with customerId: ", customerId);
        }

        // Create a checkout session for the user
        const session = await SubscriptionServices.createCheckoutSession(customerId, plan);

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: 'Subscription URL generated',
            data: { url: session.url }
        });

    } catch (err) {
        console.error('Error occurred in creating subscription session:', err);
        
        if (err instanceof AppError) {
            res.status(err.statusCode).json({ message: err.message });
        } else {
            res.status(500).json({ message: 'Server error, please try again later' });
        }
    }
});

// Stripe webhook to update subscription status
const stripeWebhook = catchAsync(async (req: Request, res: Response) => {

    const webhookSecret = envVars.STRIPE.STRIPE_WEBHOOK_SECRET
    console.log('stripe web hook is running ...')

    const sig = req.headers['stripe-signature']!;
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret!);
    } catch (err: any) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object as Stripe.Checkout.Session;
            const subscriptionId = session.subscription as string;
            const customerId = session.customer as string;

            // Update subscription in DB
            const sub = await prisma.subscription.findUnique({ where: { stripeCustomerId: customerId as string } });

            console.log(sub, 'my sub')

            if (sub) {
                await prisma.subscription.update({
                    where: { id: sub.id },
                    data: { stripeSubscriptionId: subscriptionId, status: 'active' },
                });
                await prisma.user.update({ where: { id: sub.userId }, data: { verifiedBadge: true } });

                console.log('completed')
            }
            break;

        case 'customer.subscription.deleted':
        case 'customer.subscription.updated':
            const updatedSub = event.data.object as Stripe.Subscription;

            const subRecord = await prisma.subscription.findUnique({
                where: { stripeSubscriptionId: updatedSub.id }
            })

            if (subRecord) {
                await prisma.subscription.update({
                    where: { id: subRecord.id },
                    data: {
                        status: updatedSub.status as any,
                        currentPeriodEnd: new Date((updatedSub as any).current_period_end * 1000),
                    },
                })

                await prisma.user.update({
                    where: { id: subRecord.userId },
                    data: { verifiedBadge: updatedSub.status === 'active' },
                })

                console.log('failed')
            }
            break;
    }

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Subscription webhook",
        data: { received: true }
    })
});


const verifySession = catchAsync(async (req: Request & { user?: JWTPayload }, res: Response) => {
    const sessionId = req.query.session_id as string

    if (!sessionId) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'No session id found')
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["subscription"]
    });

    const subscriptionId =
        typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id;

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Verified session',
        data: {
            subscriptionId,
            customerId: session.customer,
            status: session.payment_status,
        }
    })
})



export const SubscriptionControllers = {
    createSubscriptionSession,
    stripeWebhook,
    verifySession
}