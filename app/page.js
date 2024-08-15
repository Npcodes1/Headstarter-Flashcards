import Image from "next/image";
import {
  AppBar,
  Toolbar,
  Typography,
  Grid,
  Button,
  Box,
  Divider,
  List,
  ListItemText,
} from "@mui/material";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Home() {
  //Stripe Integration
  const handleSubmit = async () => {
    const checkoutSession = await fetch("/api/checkout_sessions", {
      method: "POST",
      headers: { origin: "http://localhost:3000" },
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
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Bits & Bytes
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in">
              Login
            </Button>
            <Button color="inherit" href="/sign-up">
              Sign Up
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>
      {/* adds headline, subheadline, and call to action buttons */}
      <Box sx={{ my: 12, textAlign: "center" }}>
        <Typography variant="h2" gutterBottom>
          Welcome to Bits & Bytes
        </Typography>
        <Typography variant="h5" gutterBottom>
          Bits of Knowledge, Bytes of Success
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2, mr: 2 }}
          href="/generate"
        >
          Get Started
        </Button>
        <Button
          variant="outlined"
          color="primary"
          sx={{
            mt: 2,
          }}
        >
          Learn More
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
            <Typography>Add your text and we do the rest!</Typography>
          </Grid>

          {/* Accessible */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight={600}>
              Accessible
            </Typography>
            <Typography>
              Access your flashcards from anywhere! Make learning on the go easy
              and efficient.
            </Typography>
          </Grid>
          {/* Organized  */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight={600}>
              Organization
            </Typography>
            <Typography>
              Our flashcards enables users to manage multiple flashcard decks
              effortlessly.
            </Typography>
          </Grid>
        </Grid>
      </Box>
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
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight={600}>
              Free
            </Typography>
            <Typography>$ 0</Typography>
            <Typography>100 flashcards</Typography>
            <Typography>
              No access to advanced customization or analytics
            </Typography>
          </Grid>

          {/* Basic */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight={600}>
              Basic
            </Typography>
            <Typography>$ 5 / month</Typography>
            <Typography>500 flashcards</Typography>
            <Typography>Basic customization and analytics</Typography>
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
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
