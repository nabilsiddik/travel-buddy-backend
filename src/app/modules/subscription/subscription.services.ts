import Stripe from "stripe";
import { envVars } from "../../config/env.config.js";

const getStripeInstance = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error(
      "STRIPE_SECRET_KEY is not defined in environment variables"
    );
  }
  return new Stripe(secretKey);
};

// Create stripe customer
export const createStripeCustomer = async (email: string) => {
  if (!email) {
    throw new Error("Email is required to create a Stripe customer");
  }

  const stripe = getStripeInstance();

  try {
    const customer = await stripe.customers.create({ email });
    return customer.id;
  } catch (err: any) {
    console.error("Error creating Stripe customer:", err.message);
    throw new Error("Failed to create Stripe customer");
  }
};

export const createCheckoutSession = async (
  customerId: string,
  plan: "monthly" | "yearly"
) => {
  if (!customerId) {
    throw new Error("Customer ID is required to create a checkout session");
  }

  const stripe = getStripeInstance();

  const priceId =
    plan === "monthly"
      ? envVars.STRIPE.STRIPE_PRICE_MONTHLY
      : envVars.STRIPE.STRIPE_PRICE_YEARLY;

  if (!priceId) {
    throw new Error(
      `Stripe price ID for plan "${plan}" is not defined in envVars`
    );
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.CLIENT_URL}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/subscription-cancelled`,
    });

    return session;
  } catch (err: any) {
    console.error("Error creating checkout session:", err.message);
    throw new Error("Failed to create Stripe checkout session");
  }
};

export const SubscriptionServices = {
  createStripeCustomer,
  createCheckoutSession,
};
