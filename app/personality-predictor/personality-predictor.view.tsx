"use client";
import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Brain,
  AlertCircle,
  Check,
  ChevronRight,
  RefreshCw,
  MessageSquare,
  Lightbulb,
  Star,
  Coffee,
  Camera,
} from "lucide-react";
import "./personality-predictor.css";
import NavBarView from "../nav-bar/nav-bar.view";
import GoogleAd from "../google-ads/google-ads.view";
import Footer from "../footer/footer.view";
import PersonalityDetectorExplanation from "./personality-predictor-description";

const EnhancedPersonalityPredictor = () => {
  const [stage, setStage] = useState<
    "intro" | "questions" | "followup" | "freetext" | "analyzing" | "results"
  >("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [questions, setQuestions] = useState<any[]>([]);
  const [followUpQuestion, setFollowUpQuestion] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [answers, setAnswers] = useState<any[]>([]);
  const [textInput, setTextInput] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<any>(null);
  const [userFeedback, setUserFeedback] = useState<boolean | null>(null);
  // const [loading, setLoading] = useState(false);
  // const [accuracy, setAccuracy] = useState(0);
  const [totalPlayed, setTotalPlayed] = useState(0);

  // Pre-defined fallback follow-up questions
  const followUpQuestions = [
    "If your life had a theme song, what would it be and why?",
    "What's the weirdest food combination you secretly enjoy?",
    "If animals could talk, which would be the rudest?",
    "What's a strange talent you have that few people know about?",
    "If you could uninvent one thing, what would it be?",
  ];

  // On initial load, fetch AI-generated questions
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const res = await fetch("/api/generateQuestions");
        const data = await res.json();
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    loadQuestions();
  }, []);

  // Handle selection of a multiple-choice option
  const handleOptionSelect = (option: string) => {
    const newAnswers = [...answers, { selected: option }];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // After all main questions, pick a random follow-up question
      const randomFollowUp =
        followUpQuestions[Math.floor(Math.random() * followUpQuestions.length)];
      setFollowUpQuestion(randomFollowUp);
      setStage("followup");
    }
  };

  const handleFollowUpSubmit = () => {
    setStage("freetext");
  };

  // Simulate an analysis API call (replace with real Hugging Face call if desired)
  const analyzeWithHuggingFace = async () => {
    // Here you would call your Hugging Face API endpoint for analysis.
    // For demonstration, we'll simulate a delay and return random traits.
    await new Promise((res) => setTimeout(res, 2000));

    const fullText = answers.map((a) => a.selected).join(" ") + " " + textInput;
    const traits = {
      extroversion: Math.random(),
      openness: Math.random(),
      conscientiousness: Math.random(),
      agreeableness: Math.random(),
    };

    let sentiment = "neutral";
    const lowerText = fullText.toLowerCase();
    if (
      lowerText.includes("love") ||
      lowerText.includes("happy") ||
      lowerText.includes("excited")
    ) {
      sentiment = "positive";
    } else if (
      lowerText.includes("hate") ||
      lowerText.includes("sad") ||
      lowerText.includes("angry")
    ) {
      sentiment = "negative";
    }

    return { traits, sentiment };
  };

  // Basic fallback analysis
  const basicAnalysis = () => {
    const fullText = answers.map((a) => a.selected).join(" ") + " " + textInput;
    return {
      sentiment: "neutral",
      traits: {
        extroversion: fullText.includes("friends") ? 0.7 : 0.3,
        openness: fullText.includes("new") ? 0.7 : 0.3,
        conscientiousness: fullText.includes("plan") ? 0.7 : 0.3,
        agreeableness: fullText.includes("help") ? 0.7 : 0.3,
      },
    };
  };

  // Generate a fun personality result based on analysis data
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const generatePersonalityResult = (data) => {
    const { extroversion, openness, conscientiousness, agreeableness } =
      data.traits;
    let title = "The Mysterious One";
    let description =
      "You defy categorization. The AI is both intrigued and slightly scared.";

    if (extroversion > 0.5 && agreeableness > 0.5) {
      title = "The Social Butterfly on Espresso";
      description =
        "You've never met a stranger. Your energy could power a small city!";
    } else if (openness > 0.5 && conscientiousness < 0.5) {
      title = "The Whimsical Wonderer";
      description =
        "You're a free spirit, brimming with curiosity and random bursts of creativity!";
    }
    // Additional personality mappings can be added here

    return {
      title,
      description,
      sentiment: data.sentiment,
      traits: data.traits,
    };
  };

  const analyzePersonality = async () => {
    // setLoading(true);
    try {
      const response = await analyzeWithHuggingFace();
      const personalityResult = generatePersonalityResult(response);
      setResult(personalityResult);
      setStage("results");
      // setLoading(false);
      setTotalPlayed((prev) => prev + 1);
    } catch (err) {
      console.error("Error analyzing personality:", err);
      const fallbackData = basicAnalysis();
      const personalityResult = generatePersonalityResult(fallbackData);
      setResult(personalityResult);
      setStage("results");
      // setLoading(false);
      setTotalPlayed((prev) => prev + 1);
    }
  };

  const handleFeedback = (isAccurate: boolean) => {
    setUserFeedback(isAccurate);
    if (isAccurate) {
      // setAccuracy((prev) => prev + 1);
    }
  };

  const resetGame = () => {
    setStage("intro");
    setCurrentQuestion(0);
    setAnswers([]);
    setTextInput("");
    setResult(null);
    setUserFeedback(null);
    setFollowUpQuestion(null);
  };

  const TraitBar = ({
    trait,
    value,
    label,
  }: {
    trait: string;
    value: number;
    label: string;
  }) => (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium">{label}</span>
        <span>{Math.round(value * 100)}%</span>
      </div>
      <div className="w-full h-3 bg-indigo-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full trait-bar-fill"
          style={{ width: `${value * 100}%` }}
          data-trait={trait}
        ></div>
      </div>
    </div>
  );

  return (
    <>
      <NavBarView />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 flex items-center justify-center enhanced-personality-container">
        <div className="w-full max-w-md mx-auto">
          {stage === "intro" && (
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 border-2 border-purple-300 doodle-card">
              <div className="px-6 py-8 sm:p-8">
                <div className="flex justify-center mb-6">
                  <div className="brain-icon-wrapper">
                    <div className="brain-ping"></div>
                    <Brain className="w-16 h-16 text-purple-600 relative z-10" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-center mb-4 gradient-text">
                  Ready to be psychoanalyzed by a computer?
                </h2>
                <p className="text-gray-600 text-center mb-8">
                  Answer a few bizarre questions, and our AI will expose your
                  deepest personality secrets!
                </p>
                <button
                  onClick={() => setStage("questions")}
                  className="w-full py-4 px-6 gradient-button text-white font-medium rounded-xl shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 transform hover:translate-y-1 transition-all duration-300"
                >
                  <span>Expose My Soul</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <div className="gradient-footer p-4 flex justify-between items-center text-sm text-gray-600">
                <div className="flex items-center">
                  <Sparkles className="w-4 h-4 text-purple-500 mr-2" />
                  <span>100% Accurate*</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-2" />
                  <span>Played {totalPlayed} times</span>
                </div>
              </div>
            </div>
          )}

          {stage === "questions" && questions.length > 0 && (
            <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border-2 border-purple-300 doodle-card">
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span className="font-medium">
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                  <span>
                    {Math.round(
                      ((currentQuestion + 1) / questions.length) * 100
                    )}
                    % Complete
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full gradient-progress rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        ((currentQuestion + 1) / questions.length) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 text-center question-text">
                  {questions[currentQuestion]?.text}
                </h2>
                <div className="space-y-3">
                  {questions[currentQuestion]?.options.map(
                    (option: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => handleOptionSelect(option)}
                        className={`w-full py-3 px-4 rounded-xl text-left font-medium transition-all duration-200 flex items-center option-button ${
                          idx % 2 === 0 ? "option-purple" : "option-indigo"
                        }`}
                      >
                        <div className="w-6 h-6 rounded-full flex items-center justify-center mr-3 bg-white option-circle">
                          {String.fromCharCode(65 + idx)}
                        </div>
                        {option}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {stage === "followup" && followUpQuestion && (
            <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border-2 border-purple-300 doodle-card">
              <div className="flex justify-center mb-6">
                <div className="lightbulb-wrapper">
                  <Lightbulb className="w-12 h-12 text-yellow-500" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-center mb-4">
                One more question...
              </h2>
              <div className="gradient-light-bg p-4 rounded-xl mb-6">
                <p className="text-gray-800 font-medium text-center">
                  {followUpQuestion}
                </p>
              </div>
              <textarea
                className="w-full p-4 border-2 border-purple-200 rounded-xl mb-6 focus:border-purple-400 focus:ring focus:ring-purple-200 focus:ring-opacity-50 resize-none transition-all duration-200 doodle-textarea"
                rows={4}
                placeholder="Don't overthink it... or do!"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
              />
              <button
                onClick={handleFollowUpSubmit}
                className="w-full py-3 px-6 gradient-button text-white font-medium rounded-xl shadow-md hover:shadow-lg flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
                disabled={!textInput.trim()}
              >
                <MessageSquare className="w-5 h-5" />
                <span>That&apos;s My Final Answer</span>
              </button>
            </div>
          )}

          {stage === "freetext" && (
            <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border-2 border-purple-300 doodle-card">
              <div className="flex justify-center mb-6">
                <div className="coffee-wrapper">
                  <div className="coffee-pulse"></div>
                  <Coffee className="w-12 h-12 text-amber-600 relative z-10" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-center mb-2">
                Let&apos;s go deeper...
              </h2>
              <p className="text-gray-600 text-center mb-6">
                Share anything else! The more random, the better our AI can read
                your mind.
              </p>
              <textarea
                className="w-full p-4 border-2 border-purple-200 rounded-xl mb-6 focus:border-purple-400 focus:ring focus:ring-purple-200 focus:ring-opacity-50 resize-none transition-all duration-200 doodle-textarea"
                rows={4}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Tell us your favorite food, dream vacation, or darkest secret..."
              />
              <button
                onClick={() => {
                  setStage("analyzing");
                  analyzePersonality();
                }}
                className="w-full py-3 px-6 orange-pink-gradient text-white font-medium rounded-xl shadow-md hover:shadow-lg flex items-center justify-center space-x-2 transition-all duration-200"
              >
                <Camera className="w-5 h-5" />
                <span>Scan My Brain!</span>
              </button>
            </div>
          )}

          {stage === "analyzing" && (
            <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 text-center border-2 border-purple-300 doodle-card">
              <div className="relative mx-auto mb-8 w-20 h-20 analyzing-brain-wrapper">
                <div className="analyzing-ping"></div>
                <div className="analyzing-spinner"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Brain className="w-10 h-10 text-indigo-600" />
                </div>
              </div>
              <h2 className="font-bold text-xl mb-4">
                Reading your thoughts...
              </h2>
              <div className="space-y-2 text-gray-600 italic mb-4">
                <p className="analysis-text-1">
                  Analyzing your secret quirks...
                </p>
                <p className="analysis-text-2">
                  Comparing you to 7 billion humans...
                </p>
                <p className="analysis-text-3">
                  Calculating your weirdness level...
                </p>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full gradient-loading"></div>
              </div>
            </div>
          )}

          {stage === "results" && result && (
            <div className="bg-white rounded-3xl shadow-xl border-2 border-purple-300 overflow-hidden doodle-card">
              <div className="p-6 sm:p-8">
                <div className="text-center mb-6">
                  <div className="inline-block gradient-circle p-4 rounded-full mb-4">
                    <Sparkles className="w-8 h-8 text-white sparkle-icon" />
                  </div>
                  <h2 className="text-2xl font-bold gradient-text mb-3">
                    {result.title}
                  </h2>
                  <p className="text-gray-700">{result.description}</p>
                </div>

                <div className="gradient-light-bg rounded-xl p-5 mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-center">
                    Your Personality Breakdown
                  </h3>

                  <TraitBar
                    trait="extroversion"
                    value={result.traits.extroversion}
                    label="Extroversion"
                  />
                  <TraitBar
                    trait="openness"
                    value={result.traits.openness}
                    label="Openness"
                  />
                  <TraitBar
                    trait="conscientiousness"
                    value={result.traits.conscientiousness}
                    label="Conscientiousness"
                  />
                  <TraitBar
                    trait="agreeableness"
                    value={result.traits.agreeableness}
                    label="Agreeableness"
                  />

                  <div className="mt-4 pt-3 border-t border-purple-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Emotional Vibe:
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium capitalize vibe-badge ${result.sentiment}-vibe`}
                      >
                        {result.sentiment}
                      </span>
                    </div>
                  </div>
                </div>

                {userFeedback === null && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-center mb-4">
                      Did we read your mind correctly?
                    </h3>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleFeedback(true)}
                        className="flex-1 py-3 px-4 bg-green-100 text-green-700 font-medium rounded-xl hover:bg-green-200 transition-colors duration-200 flex items-center justify-center doodle-button correct-button"
                      >
                        <Check className="w-5 h-5 mr-2" />
                        Scary Accurate!
                      </button>
                      <button
                        onClick={() => handleFeedback(false)}
                        className="flex-1 py-3 px-4 bg-red-100 text-red-700 font-medium rounded-xl hover:bg-red-200 transition-colors duration-200 flex items-center justify-center doodle-button wrong-button"
                      >
                        <AlertCircle className="w-5 h-5 mr-2" />
                        Not Even Close
                      </button>
                    </div>
                  </div>
                )}

                {userFeedback !== null && (
                  <div className="mb-6 p-4 rounded-xl bg-indigo-50 border border-indigo-100 text-center feedback-message">
                    <p className="text-indigo-700">
                      {userFeedback
                        ? "Wow! The AI is unstoppable! Soon it'll know your Netflix password too."
                        : "Our AI failed you. It promises to do better next time!"}
                    </p>
                  </div>
                )}

                <button
                  onClick={resetGame}
                  className="w-full py-3 px-6 gradient-button text-white font-medium rounded-xl shadow-md hover:shadow-lg flex items-center justify-center space-x-2 transition-all duration-200"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Try Again with a Different Brain!</span>
                </button>
              </div>

              <div className="gradient-footer p-4 text-center text-xs text-gray-600">
                * Results may vary. Our AI is still learning the complexity of
                human personalities.
              </div>
            </div>
          )}
        </div>
      </div>
      <GoogleAd slot={"4077644091"} className="ad-bottom" />
      <PersonalityDetectorExplanation />
      <Footer />
    </>
  );
};

export default EnhancedPersonalityPredictor;
