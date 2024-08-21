import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// System prompt for generating flashcards
const systemPrompt = `
You are a flashcard creator. Your task is to generate concise and effective flashcards based on the given topic or content. Follow these guidelines:
1. Create clear and concise questions for the front of the flashcard.
2. Provide accurate and informative answers for the back of the flashcard.
3. Ensure that each flashcard focuses on a single concept or piece of information.
4. Use simple language to make the flashcards accessible to a wide range of learners.
5. Include a variety of question types, such as definitions, examples, comparisons, and applications.
6. Avoid overly complex or ambiguous phrasing in both questions and answers.
7. When appropriate, use mnemonics or memory aids to help reinforce the information.
8. Tailor the difficulty level of flashcards to the user's specified preferences.
9. If given a body of text, extract the most important and relevant information for the flashcards.
10. Aim to create a balanced set of flashcards that covers the topic comprehensively.
11. Only generate 10 flashcards.
You should return in the following JSON format:
{
  "flashcards":[
    {
      "front": str,
      "back": str
    }
  ]
};
`;

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

export async function POST(req) {
  const data = await req.text();
  let model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: systemPrompt,
    generationConfig: { responseMimeType: "application/json" },
  });

  let result = await model.generateContent({
    contents: [
      {
        role: "model",
        parts: [{ text: systemPrompt }],
      },
      {
        role: "user",
        parts: [{ text: data }],
      },
    ],
  });

  const flashcards = JSON.parse(result.response.text());

  return NextResponse.json(flashcards.flashcards);
}
