import { NextResponse } from "next/server";
import Stripe from "stripe";

// Utility function to format the amount for Stripe.
const formatAmountForStripe = (amount, currency) => {
  return Math.round(amount * 100); // Convert dollars to cents
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

export async function POST(req) {
  try {
    // Get the request body
    const { priceId } = await req.json();

    // Ensure priceId is provided
    if (!priceId) {
      return NextResponse.json(
        { error: { message: "Price ID is required" } },
        { status: 400 }
      );
    }

    // Define checkout session parameters
    const params = {
      mode: "subscription", // Set to subscription for recurring payments
      payment_method_types: ["card"], // To accept credit cards
      line_items: [
        {
          price: priceId, // Use the priceId directly
          quantity: 1,
        },
      ],
      // Success and cancel URLs to redirect user after payment process
      success_url: `${req.headers.get(
        "origin"
      )}/result?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get(
        "origin"
      )}/result?session_id={CHECKOUT_SESSION_ID}`,
    };

    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create(params);

    // Return created session as a JSON response with a 200 success status code
    return NextResponse.json(checkoutSession, { status: 200 });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: { message: error.message } },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    // Get the session_id from the query parameters of the request
    const searchParams = req.nextUrl.searchParams;
    const session_id = searchParams.get("session_id");

    // If no session_id is provided, give an error
    if (!session_id) {
      return NextResponse.json(
        { error: { message: "Session ID is required" } },
        { status: 400 }
      );
    }

    // Retrieve checkout session details
    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

    // Return the session details as a JSON response
    return NextResponse.json(checkoutSession);
  } catch (error) {
    console.error("Error retrieving checkout session:", error);
    return NextResponse.json(
      { error: { message: error.message } },
      { status: 500 }
    );
  }
}
