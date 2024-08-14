import { loadStripe } from "@stripe/stripe-js";

//to ensure we only use one instance of Stripe. Reuse if already exists
let stripePromise;

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

export default getStripe;
