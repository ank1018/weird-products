import React from 'react';
import { AlertCircle, Zap } from 'react-feather';

export interface AiInsights {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  insights: any; // Can be an array of strings or a structured object
  source: 'cohere' | 'openrouter' | 'fallback';
  loading: boolean;
  error: string | null;
}

export interface AiInsightsTabProps {
  isDataComplete: () => boolean;
  aiInsights: AiInsights;
  getAIInsights: () => void;
}

const AiInsightsTab: React.FC<AiInsightsTabProps> = ({  aiInsights, getAIInsights }) => {
  // Render a simple list if insights is an array
  const renderSimpleInsights = (insights: string[]) => (
    <div className="insights-list">
      {insights.map((insight, index) => (
        <div key={index} className="insight-item">
          <Zap size={16} />
          <p>{insight}</p>
        </div>
      ))}
    </div>
  );

  // Render the structured fallback insights view
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderStructuredInsights = (data: any) => {
    return (
      <div className="fallback-insights">
        {/* Summary Section */}
        {data.summary && (
          <div className="section summary">
            <h4>Summary</h4>
            <p>{data.summary.overview}</p>
            {data.summary.strengths && data.summary.strengths.length > 0 && (
              <div className="subsection">
                <h5>Strengths:</h5>
                {data.summary.strengths.map((s: string, i: number) => (
                  <div key={`strength-${i}`} className="insight-item">
                    <Zap size={16} />
                    <p>{s}</p>
                  </div>
                ))}
              </div>
            )}
            {data.summary.concerns && data.summary.concerns.length > 0 && (
              <div className="subsection">
                <h5>Concerns:</h5>
                {data.summary.concerns.map((s: string, i: number) => (
                  <div key={`concern-${i}`} className="insight-item">
                    <AlertCircle size={16} />
                    <p>{s}</p>
                  </div>
                ))}
              </div>
            )}
            {data.summary.opportunities && data.summary.opportunities.length > 0 && (
              <div className="subsection">
                <h5>Opportunities:</h5>
                {data.summary.opportunities.map((s: string, i: number) => (
                  <div key={`opp-${i}`} className="insight-item">
                    <Zap size={16} />
                    <p>{s}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Income Analysis Section */}
        {data.incomeAnalysis && (
          <div className="section income-analysis">
            <h4>Income Analysis</h4>
            {data.incomeAnalysis.insights &&
              data.incomeAnalysis.insights.map((insight: string, i: number) => (
                <div key={`income-insight-${i}`} className="insight-item">
                  <Zap size={16} />
                  <p>{insight}</p>
                </div>
              ))}
            {data.incomeAnalysis.recommendations &&
              data.incomeAnalysis.recommendations.map((rec: string, i: number) => (
                <div key={`income-rec-${i}`} className="insight-item">
                  <Zap size={16} />
                  <p>{rec}</p>
                </div>
              ))}
          </div>
        )}

        {/* Expense Analysis Section */}
        {data.expenseAnalysis && (
          <div className="section expense-analysis">
            <h4>Expense Analysis</h4>
            {data.expenseAnalysis.insights &&
              data.expenseAnalysis.insights.map((insight: string, i: number) => (
                <div key={`expense-insight-${i}`} className="insight-item">
                  <Zap size={16} />
                  <p>{insight}</p>
                </div>
              ))}
            {data.expenseAnalysis.recommendations &&
              data.expenseAnalysis.recommendations.map((rec: string, i: number) => (
                <div key={`expense-rec-${i}`} className="insight-item">
                  <Zap size={16} />
                  <p>{rec}</p>
                </div>
              ))}
          </div>
        )}

        {/* Savings Analysis Section */}
        {data.savingsAnalysis && (
          <div className="section savings-analysis">
            <h4>Savings Analysis</h4>
            {data.savingsAnalysis.insights &&
              data.savingsAnalysis.insights.map((insight: string, i: number) => (
                <div key={`savings-insight-${i}`} className="insight-item">
                  <Zap size={16} />
                  <p>{insight}</p>
                </div>
              ))}
            {data.savingsAnalysis.recommendations &&
              data.savingsAnalysis.recommendations.map((rec: string, i: number) => (
                <div key={`savings-rec-${i}`} className="insight-item">
                  <Zap size={16} />
                  <p>{rec}</p>
                </div>
              ))}
          </div>
        )}

        {/* Debt Analysis Section */}
        {data.debtAnalysis && (
          <div className="section debt-analysis">
            <h4>Debt Analysis</h4>
            {data.debtAnalysis.insights &&
              data.debtAnalysis.insights.map((insight: string, i: number) => (
                <div key={`debt-insight-${i}`} className="insight-item">
                  <Zap size={16} />
                  <p>{insight}</p>
                </div>
              ))}
            {data.debtAnalysis.recommendations &&
              data.debtAnalysis.recommendations.map((rec: string, i: number) => (
                <div key={`debt-rec-${i}`} className="insight-item">
                  <Zap size={16} />
                  <p>{rec}</p>
                </div>
              ))}
            {data.debtAnalysis.repaymentPriority && data.debtAnalysis.repaymentPriority.length > 0 && (
              <div className="subsection">
                <h5>Repayment Priorities:</h5>
                {data.debtAnalysis.repaymentPriority.map((item: string, i: number) => (
                  <div key={`repay-${i}`} className="insight-item">
                    <Zap size={16} />
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Investment Analysis Section */}
        {data.investmentAnalysis && (
          <div className="section investment-analysis">
            <h4>Investment Analysis</h4>
            {data.investmentAnalysis.insights &&
              data.investmentAnalysis.insights.map((insight: string, i: number) => (
                <div key={`inv-insight-${i}`} className="insight-item">
                  <Zap size={16} />
                  <p>{insight}</p>
                </div>
              ))}
            {data.investmentAnalysis.recommendations &&
              data.investmentAnalysis.recommendations.map((rec: string, i: number) => (
                <div key={`inv-rec-${i}`} className="insight-item">
                  <Zap size={16} />
                  <p>{rec}</p>
                </div>
              ))}
            {data.investmentAnalysis.allocationAnalysis && (
              <div className="subsection">
                <h5>Portfolio Allocation:</h5>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {Object.entries(data.investmentAnalysis.allocationAnalysis).map(([key, val]: [string, any], i) => (
                  <div key={`alloc-${i}`} className="insight-item">
                    <Zap size={16} />
                    <p>
                      {`${key}: ${val.amount} (${val.percentage})`}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Goal Analysis Section */}
        {data.goalAnalysis && (
          <div className="section goal-analysis">
            <h4>Goal Analysis</h4>
            {data.goalAnalysis.insights &&
              data.goalAnalysis.insights.map((insight: string, i: number) => (
                <div key={`goal-insight-${i}`} className="insight-item">
                  <Zap size={16} />
                  <p>{insight}</p>
                </div>
              ))}
            {data.goalAnalysis.recommendations &&
              data.goalAnalysis.recommendations.map((rec: string, i: number) => (
                <div key={`goal-rec-${i}`} className="insight-item">
                  <Zap size={16} />
                  <p>{rec}</p>
                </div>
              ))}
          </div>
        )}

        {/* Overall Recommendations */}
        {data.recommendations && data.recommendations.length > 0 && (
          <div className="section overall-recommendations">
            <h4>Overall Recommendations</h4>
            {data.recommendations.map((rec: string, i: number) => (
              <div key={`overall-rec-${i}`} className="insight-item">
                <Zap size={16} />
                <p>{rec}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="ai-insights-section">
      <div className="insights-header">
        <h3>
          {aiInsights.source === 'fallback'
            ? 'Fallback Financial Insights'
            : 'AI-Powered Financial Insights'}
        </h3>
        <p className="form-instructions">
          Get personalized insights and recommendations based on your financial data.
          {aiInsights.source === 'fallback' ? (
            <span className="fallback-source">
              (Fallback insights generated automatically)
            </span>
          ) : (
            <span className="api-source">
              Powered by {aiInsights.source === 'cohere' ? 'Cohere' : 'OpenRouter'} AI
            </span>
          )}
        </p>
      </div>

      {/* {!isDataComplete() && (
        <div className="insights-warning">
          <AlertCircle size={24} />
          <p>Please complete all required information in other tabs to get insights.</p>
        </div>
      )} */}

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

      {/* Conditionally render based on the response structure */}
      {!aiInsights.loading && !aiInsights.error && aiInsights.insights && (
        <>
          {aiInsights.source === 'fallback' &&
            typeof aiInsights.insights === 'object' &&
            !Array.isArray(aiInsights.insights) ? (
            renderStructuredInsights(aiInsights.insights)
          ) : (
            renderSimpleInsights(aiInsights.insights as string[])
          )}
        </>
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
