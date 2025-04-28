// api/finance-ai-insight/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateFallbackInsights } from './generate-fallback-insights';

// Access environment variables securely on the server
const COHERE_API_KEY = process.env.COHERE_API_KEY;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Moved fallback insights generator to the server side
// const generateFallbackInsights = (data: any) => {
//   const insights: string[] = [];
  
//   // Analyze savings rate
//   if (data.metrics.savingsRate < 20) {
//     insights.push("Your savings rate is below the recommended 20%. Consider increasing your monthly savings.");
//   } else if (data.metrics.savingsRate > 30) {
//     insights.push("Great job on maintaining a high savings rate! Consider investing more of your savings.");
//   }

//   // Analyze debt situation
//   if (data.metrics.debtToIncomeRatio > 40) {
//     insights.push("Your debt-to-income ratio is high. Focus on paying down high-interest debt first.");
//   } else if (data.metrics.debtToIncomeRatio < 20) {
//     insights.push("Your debt-to-income ratio is healthy. Consider investing more aggressively.");
//   }

//   // Analyze emergency fund
//   const monthlyExpenses = data.financial.expenses.total;
//   const emergencyFund = data.financial.savings.emergency;
//   if (emergencyFund < monthlyExpenses * 3) {
//     insights.push("Build your emergency fund to cover at least 3 months of expenses.");
//   }

//   // Analyze investment diversity
//   const totalInvestments = data.financial.investments.total;
//   if (totalInvestments > 0) {
//     const investmentTypes = Object.keys(data.financial.investments).filter(k => k !== 'total');
//     if (investmentTypes.length < 3) {
//       insights.push("Consider diversifying your investments across more asset classes.");
//     }
//   }

//   // Analyze goals
//   const goals = data.financial.goals as Record<string, { amount: number }>;
//   const hasGoals = Object.values(goals).some(goal => goal.amount > 0);
//   if (!hasGoals) {
//     insights.push("Set specific financial goals to help guide your saving and investment decisions.");
//   }

//   return insights;
// };

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const analysisData = await request.json();
    
    // Try Cohere API first
    try {
      if (COHERE_API_KEY) {
        const cohereResponse = await fetch('https://api.cohere.ai/v1/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${COHERE_API_KEY}`
          },
          body: JSON.stringify({
            prompt: `Analyze this financial data and provide 5 key insights and recommendations: ${JSON.stringify(analysisData)}`,
            max_tokens: 500,
            temperature: 0.7,
            k: 0,
            stop_sequences: [],
            return_likelihoods: 'NONE'
          })
        });

        if (cohereResponse.ok) {
          const data = await cohereResponse.json();
          const insights = data.generations[0].text.split('\n').filter(Boolean);
          return NextResponse.json({
            insights,
            source: 'cohere'
          });
        }
      }
    } catch (error) {
      console.error('Cohere API failed:', error);
    }

    // Try OpenRouter as fallback
    try {
      if (OPENROUTER_API_KEY) {
        const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{
              role: 'user',
              content: `Analyze this financial data and provide 5 key insights and recommendations: ${JSON.stringify(analysisData)}`
            }]
          })
        });

        if (openRouterResponse.ok) {
          const data = await openRouterResponse.json();
          const insights = data.choices[0].message.content.split('\n').filter(Boolean);
          return NextResponse.json({
            insights,
            source: 'openrouter'
          });
        }
      }
    } catch (error) {
      console.error('OpenRouter API failed:', error);
    }

    // If we reach here, both APIs failed or API keys weren't provided
    // Generate and return fallback insights
    const fallbackInsights = generateFallbackInsights(analysisData);
    return NextResponse.json({
      insights: fallbackInsights,
      source: 'fallback'
    });

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}