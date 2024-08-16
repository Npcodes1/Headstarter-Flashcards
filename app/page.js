"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import getStripe from "@/utilis/get-stripe";

import {
  AppBar,
  Toolbar,
  Typography,
  Grid,
  Button,
  Box,
  Divider,
} from "@mui/material";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Home() {
  //check if a user is signed in
  const { isSignedIn } = useAuth();

  // Initialize router for navigation
  const router = useRouter();

  // Handle button click for "Get Started"
  const handleGetStarted = () => {
    // If user is not signed in, redirect to login/signup page
    if (!isSignedIn) {
      router.push("/sign-in");
    } else {
      // Redirect to the generate page if signed in
      router.push("/generate");
    }
  };

  //Stripe Integration
  const handleSubmit = async (priceId) => {
    const checkoutSession = await fetch("/api/checkout_sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId }),
    });

    const checkoutSessionJson = await checkoutSession.json();

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    });

    if (error) {
      console.warn(error.message);
    }
  };

  return (
    //Navbar with app title and authentication buttons
    <>
      <AppBar position="static" sx={{ bgcolor: "#F5C6C6", color: "#000" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Bits & Bytes
          </Typography>
          <SignedOut>
            <Button
              color="inherit"
              href="/sign-in"
              sx={{
                "&:hover": {
                  backgroundColor: "#000",
                  color: "#F5C6C6",
                },
              }}
            >
              Sign In
            </Button>
            <Button
              color="inherit"
              href="/sign-up"
              sx={{
                "&:hover": {
                  backgroundColor: "#000",
                  color: "#F5C6C6",
                },
              }}
            >
              Sign Up
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>
      {/* adds headline, sub-headline, and call to action buttons */}
      <Box sx={{ my: 12, textAlign: "center", px: 1.5 }}>
        <Typography variant="h2" gutterBottom>
          Welcome to Bits & Bytes
        </Typography>
        <Typography variant="h5" gutterBottom>
          Your Ultimate Tool for Tech Flashcards: Bits of Knowledge, Bytes of
          Success
        </Typography>
        <Button
          variant="contained"
          sx={{
            mt: 2,
            mr: 2,
            bgcolor: "#F5C6C6",
            color: "#000",
            "&:hover": {
              backgroundColor: "#000",
              color: "#F5C6C6",
            },
          }}
          onClick={handleGetStarted}
        >
          Get Started
        </Button>

        <Divider sx={{ my: 2, p: 4 }} />
      </Box>
      {/* Features section -highlights key features of app using grid layout */}
      <Box sx={{ mx: 10, my: 12, textAlign: "center" }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ textDecoration: "underline", my: 5 }}
        >
          Features
        </Typography>
        <Grid container spacing={4}>
          {/* Feature items - Easy to use */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight={600}>
              Easy to Use
            </Typography>
            <Typography>
              Do you feel like there are so much tech to learn? Add your
              tech-related text and we do the rest!
            </Typography>
          </Grid>

          {/* Accessible */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight={600}>
              Accessible
            </Typography>
            <Typography>
              Access your tech flashcards from anywhere! Make learning on the go
              easy and efficient.
            </Typography>
          </Grid>
          {/* Organized  */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight={600}>
              Organization
            </Typography>
            <Typography>
              Our tech flashcards enables users to manage multiple flashcard
              decks effortlessly.
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 2, p: 2 }} />
      {/* Pricing Section- shows pricing plans */}
      <Box sx={{ my: 6, textAlign: "center" }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ textDecoration: "underline" }}
        >
          Pricing
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {/* Pricing plans */}
          {/* Free */}
          {/* <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight={600}>
              Free
            </Typography>
            <Typography>$ 0</Typography>
            <Typography>100 flashcards</Typography>
            <Typography>
              No access to advanced customization or analytics
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2, mr: 2 }}
              onClick={() => handleSubmit("price_1PoFE8KDBpZ5objPDtYhbrQh")}
            >
              Buy Now
            </Button>
          </Grid> */}

          {/* Basic */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight={600}>
              Basic
            </Typography>
            <Typography>$ 5 / month</Typography>
            <Typography>500 flashcards</Typography>
            <Typography>Basic customization and analytics</Typography>
            <Button
              variant="contained"
              sx={{
                mt: 2,
                mr: 2,
                bgcolor: "#F5C6C6",
                color: "#000",
                "&:hover": {
                  backgroundColor: "#000",
                  color: "#F5C6C6",
                },
              }}
              onClick={() => handleSubmit("price_1PoFYOKDBpZ5objPWDcmTJHg")}
            >
              Buy Now
            </Button>
          </Grid>

          {/* Pro */}

          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight={600}>
              Pro
            </Typography>
            <Typography>$ 10 / month</Typography>
            <Typography>Unlimited Flashcards</Typography>
            <Typography>
              Advanced customization and detailed analytics
            </Typography>
            <Button
              variant="contained"
              sx={{
                mt: 2,
                mr: 2,
                bgcolor: "#F5C6C6",
                color: "#000",
                "&:hover": {
                  backgroundColor: "#000",
                  color: "#F5C6C6",
                },
              }}
              onClick={() => handleSubmit("price_1PoFYzKDBpZ5objPdYtv2F3C")}
            >
              Buy Now
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
