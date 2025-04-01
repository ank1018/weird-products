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
  const [isLoading, setLoading] = useState(false);
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
    setLoading(true);
    try {
      const response = await analyzeWithHuggingFace();
      const personalityResult = generatePersonalityResult(response);
      setResult(personalityResult);
      setStage("results");
      setLoading(false);
      setTotalPlayed((prev) => prev + 1);
    } catch (err) {
      console.error("Error analyzing personality:", err);
      const fallbackData = basicAnalysis();
      const personalityResult = generatePersonalityResult(fallbackData);
      setResult(personalityResult);
      setStage("results");
      setLoading(false);
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
    <div className="trait-bar">
      <div className="trait-bar-header">
        <span className="trait-label">{label}</span>
        <span className="trait-value">{Math.round(value * 100)}%</span>
      </div>
      <div className="trait-bar-container">
        <div
          className="trait-bar-fill"
          style={{ width: `${value * 100}%` }}
          data-trait={trait}
        ></div>
      </div>
    </div>
  );

  return (
    <>
      <NavBarView />
      <div className="personality-container">
        <div className="doodle-container">
          <div className="doodle doodle-star"></div>
          <div className="doodle doodle-circle"></div>
          <div className="doodle doodle-squiggle"></div>
        </div>

        <div className="content-wrapper">
          {isLoading && (
            <div className="loader-container">
              <div className="loader"></div>
              <p>Loading your personality adventure...</p>
            </div>
          )}

          {!isLoading && stage === "intro" && (
            <div className="card intro-card">
              <div className="card-content">
                <div className="brain-icon-wrapper">
                  <div className="brain-ping"></div>
                  <Brain className="brain-icon" />
                </div>
                <h2 className="card-title">
                  Ready to be psychoanalyzed by a computer?
                </h2>
                <p className="card-description">
                  Answer a few bizarre questions, and our AI will expose your
                  deepest personality secrets!
                </p>
                <button
                  onClick={() => setStage("questions")}
                  className="gradient-button"
                >
                  <span>Expose My Soul</span>
                  <ChevronRight className="button-icon" />
                </button>
              </div>
              <div className="card-footer">
                <div className="footer-item">
                  <Sparkles className="footer-icon sparkle-icon" />
                  <span>100% Accurate*</span>
                </div>
                <div className="footer-item">
                  <Star className="footer-icon star-icon" />
                  <span>Played {totalPlayed} times</span>
                </div>
              </div>
            </div>
          )}

          {!isLoading && stage === "questions" && questions.length > 0 && (
            <div className="card question-card">
              <div className="progress-container">
                <div className="progress-text">
                  <span>
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                  <span>
                    {Math.round(
                      ((currentQuestion + 1) / questions.length) * 100
                    )}
                    % Complete
                  </span>
                </div>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar"
                    style={{
                      width: `${
                        ((currentQuestion + 1) / questions.length) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="question-container">
                <h2 className="question-text">
                  {questions[currentQuestion]?.text}
                </h2>
                <div className="options-container">
                  {questions[currentQuestion]?.options.map(
                    (option: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => handleOptionSelect(option)}
                        className={`option-button ${
                          idx % 2 === 0 ? "option-purple" : "option-indigo"
                        }`}
                      >
                        <div className="option-circle">
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span className="option-text">{option}</span>
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {!isLoading && stage === "followup" && followUpQuestion && (
            <div className="card followup-card">
              <div className="lightbulb-wrapper">
                <Lightbulb className="lightbulb-icon" />
              </div>
              <h2 className="followup-title">One more question...</h2>
              <div className="followup-question-container">
                <p className="followup-question">{followUpQuestion}</p>
              </div>
              <textarea
                className="followup-textarea"
                rows={4}
                placeholder="Don't overthink it... or do!"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
              />
              <button
                onClick={handleFollowUpSubmit}
                className="followup-button"
                disabled={!textInput.trim()}
              >
                <MessageSquare className="button-icon" />
                <span>That&apos;s My Final Answer</span>
              </button>
            </div>
          )}

          {!isLoading && stage === "freetext" && (
            <div className="card freetext-card">
              <div className="coffee-wrapper">
                <div className="coffee-pulse"></div>
                <Coffee className="coffee-icon" />
              </div>
              <h2 className="freetext-title">Let&apos;s go deeper...</h2>
              <p className="freetext-description">
                Share anything else! The more random, the better our AI can read
                your mind.
              </p>
              <textarea
                className="freetext-textarea"
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
                className="freetext-button"
              >
                <Camera className="button-icon" />
                <span>Scan My Brain!</span>
              </button>
            </div>
          )}

          {!isLoading && stage === "analyzing" && (
            <div className="card analyzing-card">
              <div className="analyzing-brain-wrapper">
                <div className="analyzing-ping"></div>
                <div className="analyzing-spinner"></div>
                <div className="brain-center">
                  <Brain className="analyzing-brain-icon" />
                </div>
              </div>
              <h2 className="analyzing-title">Reading your thoughts...</h2>
              <div className="analyzing-texts">
                <p className="analysis-text analysis-text-1">
                  Analyzing your secret quirks...
                </p>
                <p className="analysis-text analysis-text-2">
                  Comparing you to 7 billion humans...
                </p>
                <p className="analysis-text analysis-text-3">
                  Calculating your weirdness level...
                </p>
              </div>
              <div className="analyzing-progress-container">
                <div className="analyzing-progress-bar"></div>
              </div>
            </div>
          )}

          {!isLoading && stage === "results" && result && (
            <div className="card results-card">
              <div className="results-header">
                <div className="sparkle-circle">
                  <Sparkles className="sparkle-icon" />
                </div>
                <h2 className="results-title">{result.title}</h2>
                <p className="results-description">{result.description}</p>
              </div>

              <div className="personality-breakdown">
                <h3 className="breakdown-title">Your Personality Breakdown</h3>

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

                <div className="emotional-vibe">
                  <span className="vibe-label">Emotional Vibe:</span>
                  <span className={`vibe-badge ${result.sentiment}-vibe`}>
                    {result.sentiment}
                  </span>
                </div>
              </div>

              {userFeedback === null && (
                <div className="feedback-section">
                  <h3 className="feedback-title">
                    Did we read your mind correctly?
                  </h3>
                  <div className="feedback-buttons">
                    <button
                      onClick={() => handleFeedback(true)}
                      className="feedback-button correct-button"
                    >
                      <Check className="feedback-icon" />
                      Scary Accurate!
                    </button>
                    <button
                      onClick={() => handleFeedback(false)}
                      className="feedback-button wrong-button"
                    >
                      <AlertCircle className="feedback-icon" />
                      Not Even Close
                    </button>
                  </div>
                </div>
              )}

              {userFeedback !== null && (
                <div className="feedback-message">
                  <p>
                    {userFeedback
                      ? "Wow! The AI is unstoppable! Soon it'll know your Netflix password too."
                      : "Our AI failed you. It promises to do better next time!"}
                  </p>
                </div>
              )}

              <button onClick={resetGame} className="restart-button">
                <RefreshCw className="button-icon" />
                <span>Try Again with a Different Brain!</span>
              </button>

              <div className="results-footer">
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
