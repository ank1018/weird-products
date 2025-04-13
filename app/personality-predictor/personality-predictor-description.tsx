"use client";

import React from "react";
import './personality-predictor-description.css';
import GoogleAd from "../google-ads/google-ads.view";

const PersonalityDetectorExplanation = () => {
  return (
    <div className="pp-description-container">
      <div className="pp-description-card">
        <div className="pp-description-content">
          <h2>How Our AI Personality Detector Works</h2>
          
          <div className="pp-description-section">
            <h3>Understanding Personality Analysis</h3>
            <p>
              Our <strong>AI Personality Detector</strong> is an interactive tool
              designed to uncover your personality traits using advanced Natural
              Language Processing (NLP) and sentiment analysis. By answering a series
              of quirky, thought-provoking questions, the AI analyzes patterns in your
              responses to generate a personalized profile based on key psychological
              traits.
            </p>
          </div>

          <div className="pp-description-section">
            <h3>The Big Five Personality Traits</h3>
            <p>
              This system draws inspiration from the{" "}
              <strong>Big Five Personality Traits</strong> model, a widely accepted
              framework in psychology. The five primary traits measured are:
            </p>

            <ul>
              <li>
                <strong>Openness</strong> – Creativity, curiosity, and a love for new
                experiences.
              </li>
              <li>
                <strong>Conscientiousness</strong> – Organization, responsibility, and
                attention to detail.
              </li>
              <li>
                <strong>Extraversion</strong> – Sociability, talkativeness, and energy
                around others.
              </li>
              <li>
                <strong>Agreeableness</strong> – Kindness, empathy, and cooperation.
              </li>
              <li>
                <strong>Neuroticism</strong> (optional) – Emotional stability and
                response to stress.
              </li>
            </ul>
          </div>

          <div className="pp-description-section">
            <h3>How the AI Makes Predictions</h3>
            <p>
              Using your selected answers and any free-form responses you provide, our
              AI performs sentiment and context analysis. Certain keywords, phrases,
              and emotional cues are mapped to personality indicators. For example:
            </p>

            <ul>
              <li>
                Saying <em>&quot;I love learning new things&quot;</em> may indicate
                high openness.
              </li>
              <li>
                <em>&quot;I plan everything ahead&quot;</em> suggests high
                conscientiousness.
              </li>
              <li>
                Words like{" "}
                <em>
                  &quot;excited&quot;, &quot;outgoing&quot;, &quot;energized&quot;
                </em>{" "}
                reflect extraversion.
              </li>
            </ul>
          </div>

          <div className="pp-description-note">
            <p>
              *Disclaimer: This tool is not intended to replace professional
              psychological evaluations. Use it as a fun way to explore your
              personality traits and spark interesting conversations!
            </p>
          </div>

          <GoogleAd slot={"2296640639"} className="pp-ad-top" />
        </div>
      </div>
    </div>
  );
};

export default PersonalityDetectorExplanation;
