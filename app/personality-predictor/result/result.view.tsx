import React from 'react';
import { Sparkles, Check, AlertCircle, RefreshCw } from 'lucide-react';
import './result.css';

// Define the TraitBar component for displaying personality traits
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const TraitBar = ({ trait, value, label }) => {
    // Calculate percentage for the visual bar
    const percentage = Math.round(value * 100);

    // Determine color based on trait
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const getTraitColor = (traitName) => {
        switch (traitName) {
            case 'extroversion':
                return 'trait-extroversion';
            case 'openness':
                return 'trait-openness';
            case 'conscientiousness':
                return 'trait-conscientiousness';
            case 'agreeableness':
                return 'trait-agreeableness';
            default:
                return 'trait-default';
        }
    };

    return (
        <div className="trait-container">
            <div className="trait-header">
                <span className="trait-label">{label}</span>
                <span className="trait-value">{percentage}%</span>
            </div>
            <div className="trait-bar-bg">
                <div
                    className={`trait-bar-fill ${getTraitColor(trait)}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

// Types for the result component
type PersonalityTraits = {
    extroversion: number;
    openness: number;
    conscientiousness: number;
    agreeableness: number;
};

type PersonalityResult = {
    title: string;
    description: string;
    traits: PersonalityTraits;
    sentiment: string;
    analysisText: string;
};

type ResultViewProps = {
    result: PersonalityResult;
    userFeedback: boolean | null;
    onFeedback: (isAccurate: boolean) => void;
    onReset: () => void;
    isLoading: boolean;
};

const ResultView: React.FC<ResultViewProps> = ({
                                                   result,
                                                   userFeedback,
                                                   onFeedback,
                                                   onReset,
                                                   isLoading
                                               }) => {
    if (isLoading || !result) {
        return (
            <div className="loading-container">
                <div className="loading-spinner" />
                <p>Analyzing your unique brain patterns...</p>
            </div>
        );
    }

    const handleFeedback = (isAccurate: boolean) => {
        onFeedback(isAccurate);
    };

    return (
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
            {result.sentiment.charAt(0).toUpperCase() + result.sentiment.slice(1)}
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

            <button onClick={onReset} className="restart-button">
                <RefreshCw className="button-icon" />
                <span>Try Again with a Different Brain!</span>
            </button>

            <div className="results-footer">
                * Results may vary. Our AI is still learning the complexity of
                human personalities.
            </div>
        </div>
    );
};

export default ResultView;
