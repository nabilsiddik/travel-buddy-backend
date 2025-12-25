import type { Request, Response } from "express";
import { catchAsync } from "../../errorHelpers/catchAsync.js";
import type { JWTPayload } from "../../interfaces/index.js";
import AppError from "../../errorHelpers/appError.js";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/prisma.config.js";
import { SubscriptionServices } from "./subscription.services.js";
import { sendResponse } from "../../utils/userResponse.js";
import { envVars } from "../../config/env.config.js";
import Stripe from "stripe";

// Get user profile info and create a subscription session
const createSubscriptionSession = catchAsync(
  async (req: Request & { user?: JWTPayload }, res: Response) => {
    const userId = req.user?.id;
    const { plan } = req.body;

    console.log({
      userId,
      plan,
    });

    if (!userId) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "User not authenticated");
    }

    //  Fetch user with subscription
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }

    //  Ensure Stripe customer exists
    let customerId = user.subscription?.stripeCustomerId;

    if (!customerId) {
      customerId = await SubscriptionServices.createStripeCustomer(user.email);

      //  Upsert subscription atomically
      await prisma.subscription.upsert({
        where: { userId },
        update: {
          stripeCustomerId: customerId,
          plan,
          status: "incomplete",
        },
        create: {
          userId,
          stripeCustomerId: customerId,
          status: "incomplete",
          plan,
        },
      });
    }

    // Create Stripe checkout session
    const session = await SubscriptionServices.createCheckoutSession(
      customerId,
      plan
    );

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Subscription checkout session created",
      data: { url: session.url },
    });
  }
);

// Stripe webhook to update subscription status
const stripeWebhook = catchAsync(async (req: Request, res: Response) => {
  const webhookSecret = envVars.STRIPE.STRIPE_WEBHOOK_SECRET;
  console.log("stripe web hook is running ...");

  const sig = req.headers["stripe-signature"]!;
  let event: Stripe.Event;

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret!);
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;
      const subscriptionId = session.subscription as string;
      const customerId = session.customer as string;

      // Update subscription in DB
      const sub = await prisma.subscription.findUnique({
        where: { stripeCustomerId: customerId as string },
      });

      if (sub) {
        await prisma.subscription.update({
          where: { id: sub.id },
          data: { stripeSubscriptionId: subscriptionId, status: "active" },
        });
        await prisma.user.update({
          where: { id: sub.userId },
          data: { verifiedBadge: true },
        });
      }
      break;

    case "customer.subscription.deleted":
    case "customer.subscription.updated":
      const updatedSub = event.data.object as Stripe.Subscription;

      const subRecord = await prisma.subscription.findUnique({
        where: { stripeSubscriptionId: updatedSub.id },
      });

      if (subRecord) {
        await prisma.subscription.update({
          where: { id: subRecord.id },
          data: {
            status: updatedSub.status as any,
            currentPeriodEnd: new Date(
              (updatedSub as any).current_period_end * 1000
            ),
          },
        });

        await prisma.user.update({
          where: { id: subRecord.userId },
          data: { verifiedBadge: updatedSub.status === "active" },
        });
      }
      break;
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Subscription webhook",
    data: { received: true },
  });
});

const verifySession = catchAsync(
  async (req: Request & { user?: JWTPayload }, res: Response) => {
    const sessionId = req.query.session_id as string;

    if (!sessionId) {
      throw new AppError(StatusCodes.BAD_REQUEST, "No session id found");
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"],
    });

    const subscriptionId =
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription?.id;

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Verified session",
      data: {
        subscriptionId,
        customerId: session.customer,
        status: session.payment_status,
      },
    });
  }
);

export const SubscriptionControllers = {
  createSubscriptionSession,
  stripeWebhook,
  verifySession,
};
