// components/FinancialPlanning/AiInsightsTab.tsx
"use client";
import React from "react";
import { AlertCircle, Lightbulb } from "lucide-react";

interface AiInsightsTabProps {
  isDataComplete: () => boolean;
  aiInsights: {
    loading: boolean;
    error: string | null;
    insights: string[];
    source: 'cohere' | 'openrouter' | 'fallback';
  };
  getAIInsights: () => void;
}

const AiInsightsTab: React.FC<AiInsightsTabProps> = ({ isDataComplete, aiInsights, getAIInsights }) => {
  return (
    <div className="ai-insights-section">
      <div className="insights-header">
        <h3>AI-Powered Financial Insights</h3>
        <p className="form-instructions">
          Get personalized insights and recommendations based on your financial data.
          {aiInsights.source !== 'fallback' && (
            <span className="api-source">
              Powered by {aiInsights.source === 'cohere' ? 'Cohere' : 'OpenRouter'} AI
            </span>
          )}
        </p>
      </div>

      {!isDataComplete() && (
        <div className="insights-warning">
          <AlertCircle size={24} />
          <p>Please complete all required information in other tabs to get AI insights.</p>
        </div>
      )}

      {aiInsights.loading && (
        <div className="insights-loading">
          <div className="loading-spinner" />
          <p>Generating insights...</p>
        </div>
      )}

      {aiInsights.error && (
        <div className="insights-error">
          <AlertCircle size={24} />
          <p>{aiInsights.error}</p>
        </div>
      )}

      {!aiInsights.loading && !aiInsights.error && aiInsights.insights.length > 0 && (
        <div className="insights-list">
          {aiInsights.insights.map((insight, index) => (
            <div key={index} className="insight-item">
              <Lightbulb size={16} />
              <p>{insight}</p>
            </div>
          ))}
        </div>
      )}

      <div className="refresh-button-container">
        <button className="refresh-insights-btn" onClick={getAIInsights}>
          Regenerate Insights
        </button>
      </div>
    </div>
  );
};

export default AiInsightsTab;

// --- Usage Example ---
// import AiInsightsTab from "./components/FinancialPlanning/AiInsightsTab";
// ...
// {activeTab === "ai-insights" && (
//   <AiInsightsTab
//     isDataComplete={isDataComplete}
//     aiInsights={aiInsights}
//     getAIInsights={getAIInsights}
//   />
// )}
