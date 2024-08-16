import { NextResponse } from "next/server";

const { GoogleGenerativeAI } = require("@google/generative-ai");

const systemPrompt = `
You are a flashcard creator, you take in text and create multiple flashcards from it. Make sure to create exactly 10 flashcards.
Both front and back should be one sentence long.
You should return in the following JSON format:
{
  "flashcards":[
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}
`;

export async function POST(req) {
  try {
    //set up the post request to create a new Gemini AI client instance and extracts the text data from the request body.
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const data = await req.text();

    // We'll implement the Gemini API call here.
    //creates a completion request to Gemini API
    const result = await model.generateContent({
      messages: [
        { role: "system", content: systemPrompt }, //holds system message with our predefined systemPrompt to instruct AI on how to create flashcards
        { role: "user", content: data }, //user message holds input text from the request body
      ],
      response_format: { type: "json_object" }, //to ensure we get a JSON response
    });

    // to process API response and return flashcards
    // Parse the JSON response from Gemini API
    const flashcards = JSON.parse(result);

    // Return the flashcards as a JSON response
    return NextResponse.json(flashcards.flashcards);
  } catch (error) {
    console.error("Error generating flashcards:", error);
    // Return an error response
    return NextResponse.json(
      { error: "Failed to generate flashcards" },
      { status: 500 }
    );
  }
}
