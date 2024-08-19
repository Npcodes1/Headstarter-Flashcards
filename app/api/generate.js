import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const systemPrompt = `
You are a flashcard creator. Your task is to generate concise and effective flashcards based on the given topic or content. Follow these guidelines:
1. Create clear and concise questions for the front of the flashcard.
2. Provide accurate and informative answers for the back of the flashcard.
3. Ensure that each flashcard focuses on a single concept or piece of information.
4. Use simple language to make the flashcards accesible to a wide range of learners\.
5. Include a variety of question types, such as definitions, examples, comparisons, and applications.
6. Avoid overly complex or ambigous phrasing in both questions and answers.
7. When appropriate, use mnemonics or memory aids to help reinforce the information.
8. Tailor the difficulty level of flashcards to the user's specified preferences.
9. if given a body of text, extract the most important and relevant information for the flashcards.
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
`

export async function POST(req) {
  
  //try {
    // Extract the input text from the request body
    const data = await req.text();
    
  const genAI = new GoogleGenerativeAI("AIzaSyB_g7XeK4b_gwGTCL8S8PUyIiUGHNKmJAs-e7i90");
    // Initialize the Google Generative AI client
    /*const genAI = new GoogleGenerativeAI({
      apiKey: AIzaSyB_g7XeK4b_gwGTCL8S8PUyIiUGHNKmJAs,
    });*/

    // Select the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Create the completion request
    const completion = await genAI.chat.completions.create({
      model: model.name,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: data },
      ],
      response_format: { type: 'json_object' },
    });

    
    console.log(completion.choices[0].message.content);

    // Parse the JSON response from the OpenAI API
    const flashcards = JSON.parse(completion.choices[0].message.content);
  
    // Return the flashcards as a JSON response
    return NextResponse.json(flashcards.flashcards);
  }

    /*// Log the full API response for debugging
    console.log("API Response:", completion);

    // Validate and parse the response
    if (
      completion &&
      completion.choices &&
      completion.choices.length > 0 &&
      completion.choices[0].message &&
      completion.choices[0].message.content
    ) {
      try {
        // Parse the JSON flashcards
        const flashcards = JSON.parse(completion.choices[0].message.content);
        return NextResponse.json(flashcards);
      } catch (parseError) {
        console.error("Error parsing flashcards:", parseError);
        throw new Error("Failed to parse flashcards from AI response.");
      }
    } else {
      // Log unexpected response structure
      console.error("Unexpected API response structure:", completion);
      throw new Error("Unexpected response structure from AI model.");
    }
  } catch (error) {
    // Handle errors gracefully and return a JSON error response
    console.error("Error generating flashcards:", error.message);
    return NextResponse.json(
      { error: "An error occurred while generating flashcards. Please try again." },
      { status: 500 }
    );
  }
}*/
