import AppError from '@/app/errorHelpers/appError';
import { StatusCodes } from 'http-status-codes';
import { stripe, SubscriptionServices } from './subscription.services';
import { sendResponse } from '@/app/utils/userResponse';
import { catchAsync } from '@/app/errorHelpers/catchAsync';
import { JWTPayload } from '@/app/interfaces';
import { Request, Response } from 'express';
import { prisma } from '@/app/config/prisma.config';
import Stripe from 'stripe';


// Get user profile info
const createSubscriptionSession = catchAsync(async (req: Request & { user?: JWTPayload }, res: Response) => {
    const userId = req?.user?.id
    const { plan } = req.body

    if (!userId) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'User id not found')
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId, status: 'ACTIVE' },
            include: { subscription: true }
        });

        if (!user) {
            throw new AppError(StatusCodes.UNAUTHORIZED, 'User not found')
        }

        let customerId = user.subscription?.stripeCustomerId;

        if (!customerId) {
            customerId = await SubscriptionServices.createStripeCustomer(user.email);

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
        }

        const session = await SubscriptionServices.createCheckoutSession(customerId, plan);

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: 'Subscription url generated',
            data: { url: session.url }
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server error' });
    }
})


// Stripe webhook to update subscription status
const stripeWebhook = catchAsync(async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature']!;
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
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
            if (sub) {
                await prisma.subscription.update({
                    where: { id: sub.id },
                    data: { stripeSubscriptionId: subscriptionId, status: 'active' },
                });
                await prisma.user.update({ where: { id: sub.userId }, data: { verifiedBadge: true } });
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



export const SubscriptionControllers = {
    createSubscriptionSession,
    stripeWebhook
}