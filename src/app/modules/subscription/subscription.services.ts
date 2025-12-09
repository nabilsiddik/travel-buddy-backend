import { envVars } from '@/app/config/env.config';
import Stripe from 'stripe';
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-11-17.clover" });

export const createStripeCustomer = async (email: string) => {
  const customer = await stripe.customers.create({ email });
  return customer.id;
}

export const createCheckoutSession = async (customerId: string, plan: 'monthly' | 'yearly') => {

  const priceId = plan === 'monthly' ? envVars.STRIPE.STRIPE_PRICE_MONTHLY : envVars.STRIPE.STRIPE_PRICE_YEARLY

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.CLIENT_URL}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/subscription-cancelled`,
  })

  return session;
}

export const SubscriptionServices = {
    createStripeCustomer,
    createCheckoutSession
}