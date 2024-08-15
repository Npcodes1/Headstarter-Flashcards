// lets existing users use authentication
import React from "react";
import {
  Container,
  Box,
  Typography,
  AppBar,
  Toolbar,
  Button,
} from "@mui/material";
import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <>
      {/* Navbar */}

      <AppBar position="static" sx={{ backgroundColor: "#3f51b5" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Bits & Bytes
          </Typography>
          <Button color="inherit">
            <Link
              href="/"
              passHref
              style={{ color: "inherit", textDecoration: "none" }}
            >
              HOME
            </Link>
          </Button>
          <Button color="inherit">
            <Link
              href="/sign-in"
              passHref
              style={{ color: "inherit", textDecoration: "none" }}
            >
              Sign In
            </Link>
          </Button>
        </Toolbar>
      </AppBar>
      {/* Sign-Up Section */}
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{ textAlign: "center", my: 4 }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Sign Up
        </Typography>
        <SignUp />
      </Box>
    </>
  );
}
