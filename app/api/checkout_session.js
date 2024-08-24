import { NextResponse } from "next/server";
import Stripe from "stripe";

//to add a utility function to format the amount for Stripe.
const formatAmountForStripe = (amount, currency) => {
  return Math.round(amount * 100);
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

export async function POST(req) {
  try {
    const params = {
      mode: "subscription", //set to subscription for recurring payments
      payment_method_types: ["card"], //to set to accepting credit cards
      line_items: [
        //there's only a pro subscription, which is $10/month
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Pro subscription",
            },
            unit_amount: formatAmountForStripe(10, "usd"), // $10.00
            recurring: {
              interval: "month",
              interval_count: 1,
            },
          },
          quantity: 1,
        },
      ],
      //success/cancel urls to redirect user after payment process
      success_url: `${req.headers.get(
        "Referer"
      )}result?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get(
        "Referer"
      )}result?session_id={CHECKOUT_SESSION_ID}`,
    };

    //to create checkout session
    const checkoutSession = await stripe.checkout.sessions.create(params);

    //return created session as a json response with a 200 success status code
    return NextResponse.json(checkoutSession, {
      status: 200,
    });

    //to catch errors
  } catch (error) {
    console.error("Error creating checkout session:", error);

    return new NextResponse(
      JSON.stringify({ error: { message: error.message } }),
      {
        status: 500,
      }
    );
  }
}

export async function GET(req) {
  //gets the session_id from the query parameters of the request
  const searchParams = req.nextUrl.searchParams;
  const session_id = searchParams.get("session_id");

  try {
    //if no session_id is provided, give error
    if (!session_id) {
      throw new Error("Session ID is required");
    }

    //retrieves checkout session details
    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

    //returns the session details as a json response
    return NextResponse.json(checkoutSession);

    //if error, return 500 status code with error message
  } catch (error) {
    console.error("Error retrieving checkout session:", error);
    return NextResponse.json(
      { error: { message: error.message } },
      { status: 500 }
    );
  }
}
