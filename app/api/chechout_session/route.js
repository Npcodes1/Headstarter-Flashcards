import { NextResponse } from "next/server";
import Stripe from "stripe";

//to add a utility function to format the amount for Stripe.
const formatAmountForStripe = (amount, currency) => {
  return Math.round(amount * 100);
};

const stripe = new Stripe(sk_test_51PnYMCKDBpZ5objPFLWbnhJUKpDHk7Nd5rzsLlefNgg8yd1OSnNI9G9cDxAQ6e6ae5S7JQMzSRIXLT1WiopuqL7b00cUgqemJX, {
  apiVersion: "2022-11-15",
});

export async function POST(req) {
    const params = {
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
                currency: 'usd',
                product_data:{
                    name: 'Pro Subscription',
                },
                unit_amount: formatAmountForStripe(10),
                recurring:{
                    interval: 'month',
                    interval_count: 1,
                }
            },
            quantity: 1,
          },
        ],
        success_url: `${req.headers.get('origin')}/result?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.get('origin')}/result?session_id={CHECKOUT_SESSION_ID}`,
      };
      const checkoutSession = await stripe.checkout.sessions.create(params)

      return NextResponse.json(checkoutSession,{
      status: 200,
    })
  }