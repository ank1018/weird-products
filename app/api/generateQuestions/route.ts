import { NextResponse } from "next/server";
import { getRandomQuestions } from "./fallbackQuestions";

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
const MODEL_ID = "mistralai/Mistral-7B-Instruct-v0.2";
const API_URL = `https://api-inference.huggingface.co/models/${MODEL_ID}`;

export async function GET() {
  // Create a prompt that instructs the model to generate JSON
  const prompt = `<s>[INST] Generate 10 personality different assessment questions that combine real-life scenarios with humor.
  Each question should reveal something meaningful about personality traits (like introversion/extroversion, conscientiousness, openness, etc.) while keeping users engaged with funny options.
Each question should have a "text" field with the question and an "options" field with exactly 4 witty answer choices.
Return ONLY valid JSON in the exact format below, with no additional text before or after:

{
  "questions": [
    {
      "text": "Your question here?",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"]
    },
    ...more questions...
  ]
}
[/INST]</s>`;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 1024,
          temperature: 0.7,
          return_full_text: false,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.statusText}`);
    }

    const apiResult = await response.json();
    // The response format may vary depending on the model
    const generatedText =
      apiResult[0]?.generated_text ||
      (Array.isArray(apiResult) && apiResult[0]) ||
      apiResult.generated_text;

    if (!generatedText) {
      throw new Error("No generated text found in API response");
    }

    // Try to parse the response as JSON first
    try {
      // Extract JSON content if there's text before or after JSON
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      const jsonContent = jsonMatch ? jsonMatch[0] : generatedText;
      const parsedData = JSON.parse(jsonContent);

      if (parsedData.questions && Array.isArray(parsedData.questions)) {
        // Verify and normalize all questions
        const validQuestions = parsedData.questions
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          .filter((q) => q.text && Array.isArray(q.options))
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          .map((q) => ({
            text: q.text,
            options: q.options.slice(0, 4),
          }));

        // Ensure each question has exactly 4 options
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const normalizedQuestions = validQuestions.map((q) => {
          if (q.options.length === 4) return q;

          // If we have fewer than 4 options, add some generic ones
          const options = [...q.options];
          while (options.length < 4) {
            options.push(`Option ${options.length + 1}`);
          }

          return {
            text: q.text,
            options: options.slice(0, 4), // Make sure we have exactly 4
          };
        });

        return NextResponse.json(normalizedQuestions);
      }
    } catch (parseError) {
      console.log("JSON parsing failed, trying manual extraction", parseError);
    }

    // Extract questions using a line-by-line approach
    const extractedQuestions = [];
    const lines = generatedText.split("\n");

    let currentQuestion = null;
    let parsingOptions = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Check for the start of a question
      if (line.includes('"text":')) {
        // If we were already parsing a question, save it
        if (currentQuestion !== null) {
          extractedQuestions.push(currentQuestion);
        }

        // Start a new question
        currentQuestion = {
          text: "",
          options: [],
        };

        // Extract the text content
        const textMatch = line.match(/"text":\s*"([^"]+)"/);
        if (textMatch && textMatch[1]) {
          currentQuestion.text = textMatch[1];
        }

        parsingOptions = false;
      }

      // Check for options
      if (line.includes('"options":')) {
        parsingOptions = true;

        // Try to extract options directly from this line
        const optionsText = line
          .substring(line.indexOf('"options":') + '"options":'.length)
          .trim();

        // Handle different formats of options
        if (
          optionsText.startsWith("[") &&
          (optionsText.endsWith("]") || optionsText.endsWith('"]'))
        ) {
          // Options are on a single line
          parseOptionsFromText(optionsText, currentQuestion);
        }
        // Otherwise, we'll continue parsing in the next iterations
      } else if (parsingOptions && currentQuestion && line.includes('"')) {
        // This line might contain continuation of options
        if (line.includes("]")) {
          // This is the end of options
          const optionsText = line.substring(0, line.indexOf("]") + 1);
          parseOptionsFromText(optionsText, currentQuestion, true);
          parsingOptions = false;
        } else {
          // This is part of options, add it to the current question's options
          parseOptionsFromText(line, currentQuestion, true);
        }
      }
    }

    // Add the last question if we were parsing one
    if (currentQuestion !== null && currentQuestion.text) {
      extractedQuestions.push(currentQuestion);
    }

    // Post-process the questions to ensure they have text and exactly 4 options
    const PLACEHOLDER_REGEX = /^Option\s\d+$/i;

    const formattedQuestions = extractedQuestions
      .filter((q) => q.text && q.text.trim() !== "")
      .map((q) => {
        // Fix for long comma-separated options string
        // Check if the first option is actually a comma-separated list
        if (
          q.options.length >= 1 &&
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          q.options[0].includes(", ") &&
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          q.options[0].split(", ").length >= 3
        ) {
          // Split the first option by commas
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          const splitOptions = q.options[0].split(", ");
          // Replace options with the split array
          q.options = splitOptions;
        }

        // Remove placeholder options like "Option 1"
        const cleanOptions = q.options
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          .filter((opt) => opt && opt.trim() !== "")
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          .map((opt) => opt.trim())
          .filter((opt) => !PLACEHOLDER_REGEX.test(opt));

        // If we have no real options, skip this question
        if (cleanOptions.length === 0) return null;

        const finalOptions = [...cleanOptions];
        // Generate unique options for any missing slots
        while (finalOptions.length < 4) {
          finalOptions.push(`Additional option ${finalOptions.length + 1}`);
        }

        return {
          text: q.text,
          options: finalOptions.slice(0, 4),
        };
      })
      .filter(Boolean); // Remove any nulls from skipped questions

    if (formattedQuestions.length > 0) {
      return NextResponse.json(formattedQuestions);
    }

    // If line-by-line parsing fails, try direct regex extraction
    const regexQuestions = [];
    const questionRegex = /"text"\s*:\s*"([^"]+)"/g;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const optionsRegex = /"options"\s*:\s*\[(.*?)\]/gs;

    let questionMatch;
    let optionsMatch;

    // Reset regex indices
    questionRegex.lastIndex = 0;
    optionsRegex.lastIndex = 0;

    // Extract all questions
    const questionTexts = [];
    while ((questionMatch = questionRegex.exec(generatedText)) !== null) {
      questionTexts.push(questionMatch[1]);
    }

    // Extract all options
    const optionSets = [];
    while ((optionsMatch = optionsRegex.exec(generatedText)) !== null) {
      const parsedQuestion = { options: [] };
      parseOptionsFromText(optionsMatch[1], parsedQuestion);

      // Special handling for comma-separated options in a single string
      if (
        parsedQuestion.options.length === 1 &&
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        parsedQuestion.options[0].includes(", ")
      ) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        parsedQuestion.options = parsedQuestion.options[0].split(", ");
      }

      optionSets.push(parsedQuestion.options);
    }

    // Combine questions and options
    for (
      let i = 0;
      i < Math.min(questionTexts.length, optionSets.length);
      i++
    ) {
      // Ensure we have 4 options
      const options = optionSets[i].slice(0, 4);
      while (options.length < 4) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        options.push(`Additional option ${options.length + 1}`);
      }

      regexQuestions.push({
        text: questionTexts[i],
        options: options,
      });
    }

    if (regexQuestions.length > 0) {
      return NextResponse.json(regexQuestions);
    }

    throw new Error("Failed to extract valid questions from response");
  } catch (error) {
    console.error("Error in generateQuestions API:", error);

    // Fallback mock data in case of failure
    const fallbackQuestions = getRandomQuestions(8);

    return NextResponse.json(fallbackQuestions);
  }
}

// Helper function to parse options from text
function parseOptionsFromText(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  optionsText,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  questionObj,
  isContinuation = false
) {
  if (!questionObj) return;

  // If this isn't a continuation, initialize options array
  if (!isContinuation) {
    questionObj.options = [];
  }

  // Clean up the options text
  let cleanedText = optionsText.trim();

  // Remove brackets if present
  if (cleanedText.startsWith("[")) {
    cleanedText = cleanedText.substring(1);
  }
  if (cleanedText.endsWith("]")) {
    cleanedText = cleanedText.substring(0, cleanedText.length - 1);
  }

  // Special case: check for comma-separated items in quotes
  // This pattern looks for options like: "Option 1", "Option 2", "Option 3", "Option 4"
  const quotedOptionsPattern = /"([^"]+)"/g;
  const quotedMatches = [...cleanedText.matchAll(quotedOptionsPattern)];

  if (quotedMatches.length >= 2) {
    // We found quoted options, use these instead of other parsing methods
    quotedMatches.forEach((match) => {
      if (match[1] && match[1].trim()) {
        questionObj.options.push(match[1].trim());
      }
    });
    return;
  }

  // Case 1: Options formatted as a single string with A), B), etc.
  if (cleanedText.includes("A)") && cleanedText.includes("B)")) {
    const singleOption = cleanedText.replace(/^"/, "").replace(/"$/, "");

    // Split by A), B), etc. pattern
    const splitOptions = singleOption
      .split(/(?:[A-D]\)\s*|or\s+D\)\s*)/)
      .filter(Boolean);

    for (const opt of splitOptions) {
      const cleanOpt = opt
        .trim()
        .replace(/,$/, "")
        .replace(/^"/, "")
        .replace(/"$/, "");
      if (cleanOpt) {
        questionObj.options.push(cleanOpt);
      }
    }
    return;
  }

  // Case 2: Fix misplaced brackets in options
  if (
    cleanedText.includes(
      "Mr. Joker (constantly cracking jokes, but gets work done)]"
    )
  ) {
    questionObj.options.push(
      "Mr. Joker (constantly cracking jokes, but gets work done)"
    );
    return;
  }

  // Case 3: Split by commas, but only outside quotes
  let inQuote = false;
  let currentOption = "";
  const options = [];

  for (let i = 0; i < cleanedText.length; i++) {
    const char = cleanedText[i];

    if (char === '"') {
      inQuote = !inQuote;
      currentOption += char;
    } else if (char === "," && !inQuote) {
      // End of an option
      options.push(currentOption.trim());
      currentOption = "";
    } else {
      currentOption += char;
    }
  }

  // Add the last option if there is one
  if (currentOption.trim()) {
    options.push(currentOption.trim());
  }

  // Process each option
  options.forEach((opt) => {
    addOptionToQuestion(opt, questionObj);
  });
}

// Helper function to clean and add an option to a question
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
function addOptionToQuestion(optionText, questionObj) {
  if (!optionText) return;

  const cleanedOption = optionText
    .trim()
    .replace(/^"/, "")
    .replace(/"$/, "")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\")
    .trim();

  if (cleanedOption) {
    // Handle emojis in options
    const processedOption =
      cleanedOption.includes("🤐") ||
      cleanedOption.includes("😂") ||
      cleanedOption.includes("💼") ||
      cleanedOption.includes("😴")
        ? cleanedOption.replace(/ for .*$/, "")
        : cleanedOption;

    questionObj.options.push(processedOption);
  }
}
