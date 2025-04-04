"use client";

import React from "react";
import './personality-predictor.css';

const PersonalityDetectorExplanation = () => {
  return (
    <div className="pp-info-section seo-description">
      <h3>How Our AI Personality Detector Works</h3>

      <p>
        Our <strong>AI Personality Detector</strong> is an interactive tool
        designed to uncover your personality traits using advanced Natural
        Language Processing (NLP) and sentiment analysis. By answering a series
        of quirky, thought-provoking questions, the AI analyzes patterns in your
        responses to generate a personalized profile based on key psychological
        traits.
      </p>

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

      <p>
        Our model is designed to be fun, insightful, and surprisingly
        accurate—but remember, it’s all in good fun. Use it as a conversation
        starter, self-reflection tool, or just a quirky AI experiment!
      </p>

      <p>
        *Disclaimer: This tool is not intended to replace professional
        psychological evaluations.
      </p>
    </div>
  );
};

export default PersonalityDetectorExplanation;
