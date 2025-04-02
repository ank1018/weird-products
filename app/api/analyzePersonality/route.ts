export const runtime = "nodejs";
import { NextResponse } from 'next/server';

// Function to analyze user responses via Hugging Face API
export async function POST(req: Request) {
    try {
        const { questions, answers, textInput } = await req.json();

        let userAnswers = "";
        for (let i = 0; i < questions.length; i++) {
            userAnswers =
                userAnswers +
                "\n\n" +
                `Question: ${questions[i].text ?? ""}\nAnswer: ${
                    answers[i].selected ?? ""
                }`;
        }

        // Create a structured prompt for the AI model
        const prompt = `
  Based on the following quiz responses, analyze this person's personality traits in terms of extroversion, openness, conscientiousness, and agreeableness on a scale from 0.0 to 1.0. Also determine if their overall sentiment is positive, negative, or neutral.
  
  ${userAnswers}
  
  Additional thoughts from user: ${textInput}
  
  Analysis:
  `;

        // Hugging Face API endpoint for a large language model
        const MODEL_ID = "mistralai/Mistral-7B-Instruct-v0.2";
        const API_URL = `https://api-inference.huggingface.co/models/${MODEL_ID}`;

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    max_length: 512,
                    temperature: 0.7,
                    return_full_text: false,
                },
            }),
        });
        if (!response.ok) {
            console.error(`HTTP error! Status: ${response.status}`);
            return NextResponse.json({ error: "Error from Hugging Face API" }, { status: response.status });
        }

        const rawResponse = await response.json();
        const generatedText = rawResponse[0]?.generated_text || "";

        // Parse the AI's response to extract personality traits
        try {
            // Look for trait scores in the text
            const extractTraitScore = (text: string, traitName: string) => {
                const regex = new RegExp(`${traitName}[^0-9]*([0-9]\\.[0-9])`, "i");
                const match = text.match(regex);
                return match ? parseFloat(match[1]) : 0.5; // Default to 0.5 if not found
            };

            // Look for sentiment classification
            const extractSentiment = (text: string) => {
                const lowerText = text.toLowerCase();
                if (
                    lowerText.includes("sentiment: positive") ||
                    lowerText.includes("positive sentiment")
                ) {
                    return "positive";
                } else if (
                    lowerText.includes("sentiment: negative") ||
                    lowerText.includes("negative sentiment")
                ) {
                    return "negative";
                } else {
                    return "neutral";
                }
            };

            // Extract traits and sentiment
            const traits = {
                extroversion: extractTraitScore(generatedText, "extroversion"),
                openness: extractTraitScore(generatedText, "openness"),
                conscientiousness: extractTraitScore(
                    generatedText,
                    "conscientiousness"
                ),
                agreeableness: extractTraitScore(generatedText, "agreeableness"),
            };

            const sentiment = extractSentiment(generatedText);

            // Return parsed results along with raw response for debugging
            return NextResponse.json({
                traits,
                sentiment,
                analysisText: generatedText,
                rawResponse,
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (parseError: any) {
            console.error("Error parsing AI response:", parseError);
            return NextResponse.json({
                traits: {
                    extroversion: 0.5,
                    openness: 0.5,
                    conscientiousness: 0.5,
                    agreeableness: 0.5,
                },
                sentiment: "neutral",
                analysisText: generatedText,
                parseError: parseError.message,
            });
        }
    }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (apiError: any) {
        console.error("Error calling Hugging Face API:", apiError);
        return NextResponse.json({ error: apiError.message || "An error occurred" }, { status: 500 });
    }
}
