"use client";
import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Brain,
  ChevronRight,
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
import ResultView from "./result/result.view";

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

  // Basic fallback analysis
  const basicAnalysis = () => {
      const traits = {
        extroversion: 0,
        openness: 0,
        conscientiousness: 0,
        agreeableness: 0,
      };

      answers.forEach(answer => {
        const selected = answer.selected.toLowerCase();

        if (/party|socializing|friends|attention|adventure|lead|excitement|karaoke|center|sing|brunch|funny|late|dramatic|social|outdoors|action|drinks|espresso|memes|fashionably|predict|intense|socializing/.test(selected)) {
          traits.extroversion += 3;
        }
        if (/meditate|daydream|improvise|curiosity|random|free spirit|explore|creative|ideas|new|netflix|cluttered|comfy|documentary|relax|zone|hide|quietly|lurking|invisibility|freedom|mysterious|sleep|spontaneous|whimsical|curious|adventure/.test(selected)) {
          traits.openness += 3;
        }
        if (/organize|plan|precision|checklists|reliable|responsible|meticulously|meal prep|minimalist|order|lead|structured|gps|grammar|organized|coordinate|pack|meticulous|planner|notes|responsible|prepare/.test(selected)) {
          traits.conscientiousness += 3;
        }
        if (/help|mediate|peace|pets|reliable|thoughtful|advice|friends|empathetic|cooperative|kind|harmony|grateful|comfort|advice|calming|friendly|agreeable|support|donate|cooperate|peacekeeper|peaceful|thoughtful/.test(selected)) {
          traits.agreeableness += 3;
        }
      });

      const total = answers.length;

      return {
        sentiment: traits.extroversion > total / 2 ? "positive" : "neutral",
        traits: {
          extroversion: traits.extroversion / total,
          openness: traits.openness / total,
          conscientiousness: traits.conscientiousness / total,
          agreeableness: traits.agreeableness / total,
        },
        analysisText: "Based on your answers, we've determined your key personality traits!",
      };
    };

  // Generate a fun personality result based on analysis data
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const generatePersonalityResult = (data) => {
    const { extroversion, openness, conscientiousness, agreeableness } = data.traits;
    let title = "The Mysterious One";
    let description = data.analysisText;

    if (extroversion >= 0.6 && agreeableness >= 0.6) {
      title = "The Social Butterfly";
      description = "You're outgoing, friendly, and love to connect with others! You're always ready to engage, make new friends, and keep social situations lively and fun. Your vibrant energy lights up any room, and your warm personality makes everyone feel included.";
    } else if (openness >= 0.6 && conscientiousness < 0.4) {
      title = "The Whimsical Explorer";
      description = "Creative and endlessly curious, you're always seeking out new experiences and adventures. Your spontaneous nature means there's never a dull moment around you. You embrace uncertainty and thrive in situations that require flexibility and imagination.";
    } else if (conscientiousness >= 0.6) {
      title = "The Master Planner";
      description = "Reliable, organized, and thoughtful—you thrive on structure and precision. Your meticulous nature ensures everything is always in order and tasks get done efficiently. People count on you for your dependability and your ability to foresee and manage details.";
    } else if (agreeableness >= 0.6) {
      title = "The Peacekeeper";
      description = "Kind-hearted, empathetic, and cooperative, you naturally mediate conflicts and strive to create harmony. Your calming presence is greatly valued by those around you. People trust you with their feelings because they know you genuinely care and listen.";
    }

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
      const response = await fetch("/api/analyzePersonality", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questions,
          answers,
          textInput,
        }),
      });
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }
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

          {/* Results section */}
          {!isLoading && stage === "results" && result && (
              <ResultView
                  result={result}
                  userFeedback={userFeedback}
                  onFeedback={handleFeedback}
                  onReset={resetGame}
                  isLoading={isLoading}
              />
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
