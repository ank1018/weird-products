/**
 * Interfaces for input data
 */
interface Personal {
    age: number;
    employmentStatus: "employed" | "self-employed" | string;
    maritalStatus: string;
    dependents: number;
    city: string;
  }
  
  interface Income {
    salary: number;
    other: number;
    total: number;
  }
  
  interface Expenses {
    housing: number;
    transportation: number;
    food: number;
    utilities: number;
    entertainment: number;
    healthcare: number;
    education: number;
    debt: number;
    other: number;
    total: number;
  }
  
  interface Savings {
    emergency: number;
    retirement: number;
    investment: number;
    other: number;
    total: number;
  }
  
  interface Investments {
    stocks: number;
    bonds: number;
    realEstate: number;
    mutualFunds: number;
    crypto: number;
    other: number;
    total: number;
  }
  
  interface DebtDetail {
    amount: number;
    interestRate: number;
  }
  
  interface Debt {
    mortgage: DebtDetail;
    car: DebtDetail;
    student: DebtDetail;
    creditCard: DebtDetail;
    personal: DebtDetail;
    other: DebtDetail;
    total: number;
  }
  
  interface Goal {
    amount: number;
    timeline: number;
    description: string;
  }
  
  interface Goals {
    shortTerm: Goal;
    mediumTerm: Goal;
    longTerm: Goal;
  }
  
  interface Financial {
    income: Income;
    expenses: Expenses;
    savings: Savings;
    investments: Investments;
    debt: Debt;
    goals: Goals;
  }
  
  interface Metrics {
    savingsRate: number;         // in percentage
    debtToIncomeRatio: number;   // in percentage
    financialHealthScore: number; // score out of 100
  }
  
  interface Data {
    personal: Personal;
    financial: Financial;
    metrics: Metrics;
  }
  
  /**
   * Interfaces for output data (results)
   */
  interface Summary {
    overview: string;
    strengths: string[];
    concerns: string[];
    opportunities: string[];
  }
  
  interface Analysis {
    insights: string[];
    recommendations: string[];
  }
  
  interface DebtAnalysis extends Analysis {
    repaymentPriority?: string[];
  }
  
  interface InvestmentAllocation {
    amount: number;
    percentage: string;
  }
  
  interface InvestmentAnalysis extends Analysis {
    allocationAnalysis: { [key: string]: InvestmentAllocation };
  }
  
  interface GoalFeasibility {
    goalAmount: number;
    timeline: number;
    monthlyRequired: number;
    feasibility: string;
  }
  
  interface GoalAnalysis extends Analysis {
    goalFeasibility?: {
      shortTerm?: GoalFeasibility;
      mediumTerm?: GoalFeasibility;
      longTerm?: GoalFeasibility;
    };
  }
  
  interface ComprehensiveInsights {
    summary: Summary;
    incomeAnalysis: Analysis;
    expenseAnalysis: Analysis;
    savingsAnalysis: Analysis;
    debtAnalysis: DebtAnalysis;
    investmentAnalysis: InvestmentAnalysis;
    goalAnalysis: GoalAnalysis;
    recommendations: string[];
  }
  
  interface InsightError {
    error: string;
    recommendations: string[];
  }
  
  /**
   * Generate comprehensive fallback financial insights when AI analysis fails
   * @param data - The user's financial data
   * @returns Comprehensive financial insights and recommendations
   */
  export function generateFallbackInsights(
    data: Data | null
  ): ComprehensiveInsights | InsightError {
    // Ensure we have valid data to work with
    if (!data || !data.personal || !data.financial || !data.metrics) {
      return {
        error: "Insufficient financial data available to generate insights",
        recommendations: [
          "Please provide complete financial information for a thorough analysis."
        ]
      };
    }
  
    // Extract key data components
    const { personal, financial, metrics } = data;
  
    // Initialize results object
    const results: ComprehensiveInsights = {
      summary: {} as Summary,
      incomeAnalysis: {} as Analysis,
      expenseAnalysis: {} as Analysis,
      savingsAnalysis: {} as Analysis,
      debtAnalysis: { insights: [], recommendations: [] },
      investmentAnalysis: { insights: [], recommendations: [], allocationAnalysis: {} },
      goalAnalysis: { insights: [], recommendations: [] },
      recommendations: []
    };
  
    // Generate summary insights
    results.summary = generateSummaryInsights(personal, financial, metrics);
  
    // Generate detailed analysis for each financial category
    results.incomeAnalysis = analyzeIncome(financial.income, personal);
    results.expenseAnalysis = analyzeExpenses(financial.expenses, financial.income);
    results.savingsAnalysis = analyzeSavings(financial.savings, financial.expenses, financial.income);
    results.debtAnalysis = analyzeDebt(financial.debt, financial.income);
    results.investmentAnalysis = analyzeInvestments(financial.investments, personal);
    results.goalAnalysis = analyzeFinancialGoals(financial.goals, financial);
  
    // Generate prioritized recommendations
    results.recommendations = generatePrioritizedRecommendations(
      results,
      personal,
      financial,
      metrics
    );
  
    return results;
  }
  
  /**
   * Generate summary insights based on overall financial health
   */
  function generateSummaryInsights(
    personal: Personal,
    financial: Financial,
    metrics: Metrics
  ): Summary {
    const summary: Summary = {
      overview: "",
      strengths: [],
      concerns: [],
      opportunities: []
    };
  
    // Create personalized summary based on age and life stage
    let lifeStage = "";
    if (personal.age < 30) lifeStage = "early career";
    else if (personal.age < 45) lifeStage = "mid-career";
    else if (personal.age < 60) lifeStage = "pre-retirement";
    else lifeStage = "retirement";
  
    // Calculate key financial indicators
    const totalAssets = (financial.savings.total || 0) + (financial.investments.total || 0);
    const totalLiabilities = financial.debt.total || 0;
    const netWorth = totalAssets - totalLiabilities;
    const monthlyIncome = (financial.income.total || 0) / 12;
    const monthlyExpenses = (financial.expenses.total || 0) / 12;
    const monthlyCashFlow = monthlyIncome - monthlyExpenses;
  
    // Generate overview
    summary.overview = `As a ${personal.age}-year-old ${personal.maritalStatus} individual in ${lifeStage} phase with ${personal.dependents} dependent(s), your current financial position shows a net worth of ${formatCurrency(
      netWorth
    )} with monthly cash flow of ${formatCurrency(monthlyCashFlow)}.`;
  
    // Identify financial strengths
    if (metrics.savingsRate > 20) {
      summary.strengths.push("Strong savings rate above recommended 20% threshold");
    }
  
    if (totalAssets > totalLiabilities) {
      summary.strengths.push("Positive net worth with assets exceeding liabilities");
    }
  
    const invKeys = Object.keys(financial.investments).filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      k => k !== "total" && (financial.investments as any)[k] > 0
    );
    if (financial.investments.total > 0 && invKeys.length >= 3) {
      summary.strengths.push("Well-diversified investment portfolio across multiple asset classes");
    }
  
    if (monthlyCashFlow > 0) {
      summary.strengths.push("Positive monthly cash flow, creating opportunity for additional savings and investments");
    }
  
    // Identify financial concerns
    if (metrics.debtToIncomeRatio > 36) {
      summary.concerns.push("High debt-to-income ratio exceeding recommended 36% threshold");
    }
  
    if (!financial.savings.emergency || financial.savings.emergency < financial.expenses.total * 3) {
      summary.concerns.push("Insufficient emergency fund (recommended: 3-6 months of expenses)");
    }
  
    if (financial.debt.creditCard && financial.debt.creditCard.amount > 0) {
      summary.concerns.push("High-interest credit card debt affecting financial health");
    }
  
    // Identify opportunities
    if (financial.income.other === 0) {
      summary.opportunities.push("Potential to develop additional income streams");
    }
  
    if (financial.expenses.total / financial.income.total > 0.7) {
      summary.opportunities.push("Opportunity to optimize expenses and increase savings rate");
    }
  
    if (
      !financial.goals.shortTerm.amount &&
      !financial.goals.mediumTerm.amount &&
      !financial.goals.longTerm.amount
    ) {
      summary.opportunities.push("Establish specific financial goals to guide saving and investment strategy");
    }
  
    return summary;
  }
  
  /**
   * Analyze income sources and stability
   */
  function analyzeIncome(income: Income, personal: Personal): Analysis {
    const analysis: Analysis = {
      insights: [],
      recommendations: []
    };
  
    // Calculate income metrics
    const totalIncome = income.total || 0;
    const salariedIncome = income.salary || 0;
    const otherIncome = income.other || 0;
    const incomeSourceDiversification = totalIncome > 0 ? otherIncome / totalIncome : 0;
  
    // Generate insights based on income
    if (totalIncome > 0) {
      analysis.insights.push(
        `Your monthly income of ${formatCurrency(
          totalIncome
        )} places you in ${determineIncomePercentile(totalIncome, personal.city)} income bracket for ${personal.city}.`
      );
    }
  
    if (salariedIncome === totalIncome && salariedIncome > 0) {
      analysis.insights.push(`You currently rely entirely on salaried income, which represents 100% of your total income.`);
      analysis.recommendations.push("Explore additional income sources to diversify and improve financial security.");
    } else if (incomeSourceDiversification < 0.2 && salariedIncome > 0) {
      analysis.insights.push(
        `Your income has limited diversification with salary representing ${Math.round(
          (salariedIncome / totalIncome) * 100
        )}% of total income.`
      );
      analysis.recommendations.push("Consider developing additional income streams to reduce dependence on primary employment.");
    } else if (incomeSourceDiversification >= 0.2) {
      analysis.insights.push(
        `You have a healthy income diversification with ${Math.round(incomeSourceDiversification * 100)}% coming from sources beyond primary salary.`
      );
    }
  
    if (personal.employmentStatus === "employed") {
      analysis.recommendations.push("Research industry salary benchmarks to ensure your compensation is competitive.");
      analysis.recommendations.push("Consider upskilling opportunities that could lead to income growth in your field.");
    } else if (personal.employmentStatus === "self-employed") {
      analysis.recommendations.push("Evaluate pricing strategy and client mix to maximize income potential.");
      analysis.recommendations.push("Consider business structure optimization for tax efficiency.");
    }
  
    return analysis;
  }
  
  /**
   * Analyze expense patterns and identify optimization opportunities
   */
  function analyzeExpenses(expenses: Expenses, income: Income): Analysis {
    const analysis: Analysis = {
      insights: [],
      recommendations: []
    };
  
    // Calculate expense metrics
    const totalExpenses = expenses.total || 0;
    const totalIncome = income.total || 0;
    const expenseToIncomeRatio = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;
  
    // Categorize and analyze expenses
    const housingExpenseRatio = expenses.housing ? (expenses.housing / totalExpenses) * 100 : 0;
    const transportationExpenseRatio = expenses.transportation ? (expenses.transportation / totalExpenses) * 100 : 0;
    const foodExpenseRatio = expenses.food ? (expenses.food / totalExpenses) * 100 : 0;
    const discretionaryExpenses = (expenses.entertainment || 0) + (expenses.other || 0);
    const discretionaryExpenseRatio = (discretionaryExpenses / totalExpenses) * 100;
  
    // Generate expense insights
    analysis.insights.push(
      `Your expense-to-income ratio is ${expenseToIncomeRatio.toFixed(
        1
      )}%, which is ${expenseToIncomeRatio <= 70 ? "healthy" : "higher than the recommended 70% threshold"}.`
    );
  
    if (housingExpenseRatio > 0) {
      analysis.insights.push(
        `Housing represents ${housingExpenseRatio.toFixed(1)}% of your total expenses${
          housingExpenseRatio > 30 ? ", which exceeds the recommended 30% threshold" : ""
        }.`
      );
      if (housingExpenseRatio > 30) {
        analysis.recommendations.push("Consider housing alternatives or refinancing options to reduce housing costs.");
      }
    }
  
    if (transportationExpenseRatio > 15) {
      analysis.insights.push(`Transportation costs (${transportationExpenseRatio.toFixed(1)}% of expenses) exceed typical recommendations.`);
      analysis.recommendations.push("Evaluate transportation alternatives or vehicle ownership costs to reduce expenses.");
    }
  
    if (foodExpenseRatio > 15) {
      analysis.insights.push(`Food expenses represent ${foodExpenseRatio.toFixed(1)}% of your total spending.`);
      analysis.recommendations.push("Analyze grocery and dining patterns for potential optimization.");
    }
  
    if (discretionaryExpenseRatio > 30) {
      analysis.insights.push(`Discretionary spending accounts for ${discretionaryExpenseRatio.toFixed(1)}% of total expenses.`);
      analysis.recommendations.push("Track discretionary spending more carefully to identify potential savings opportunities.");
    }
  
    // Add general expense recommendations
    if (expenseToIncomeRatio > 70) {
      analysis.recommendations.push("Implement a structured budget to reduce expenses and improve financial resilience.");
    }
  
    return analysis;
  }
  
  /**
   * Analyze savings patterns and emergency preparedness
   */
  function analyzeSavings(savings: Savings, expenses: Expenses, income: Income): Analysis {
    const analysis: Analysis = {
      insights: [],
      recommendations: []
    };
  
    // Calculate savings metrics
    const totalSavings = savings.total || 0;
    const emergencySavings = savings.emergency || 0;
    const retirementSavings = savings.retirement || 0;
    const monthlyExpenses = (expenses.total || 0);
    const monthsOfEmergencyFund = monthlyExpenses > 0 ? emergencySavings / monthlyExpenses : 0;
    const totalIncome = income.total || 0;
    const savingsRate = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0;
  
    // Generate savings insights
    analysis.insights.push(
      `Your current savings rate is ${savingsRate.toFixed(
        1
      )}%, which is ${savingsRate >= 20 ? "at or above" : "below"} the recommended minimum of 20%.`
    );
  
    if (monthsOfEmergencyFund < 3) {
      analysis.insights.push(
        `Your emergency fund covers approximately ${monthsOfEmergencyFund.toFixed(
          1
        )} months of expenses, below the recommended 3-6 months.`
      );
      analysis.recommendations.push(`Build emergency fund to at least ${formatCurrency(monthlyExpenses * 3)} (3 months of expenses).`);
    } else if (monthsOfEmergencyFund < 6) {
      analysis.insights.push(
        `Your emergency fund covers approximately ${monthsOfEmergencyFund.toFixed(
          1
        )} months of expenses, which meets minimum recommendations but could be strengthened.`
      );
      analysis.recommendations.push(`Consider increasing emergency fund to ${formatCurrency(monthlyExpenses * 6)} (6 months of expenses) for added security.`);
    } else {
      analysis.insights.push(`Your emergency fund is well-established with ${monthsOfEmergencyFund.toFixed(1)} months of expenses covered.`);
    }
  
    if (retirementSavings === 0) {
      analysis.insights.push("No retirement savings detected, which represents a significant gap in long-term financial planning.");
      analysis.recommendations.push("Begin retirement contributions immediately, even if starting with small amounts.");
    }
  
    // Add savings recommendations
    if (savingsRate < 20) {
      analysis.recommendations.push("Increase savings rate to at least 20% of income through expense reduction or income growth.");
    }
  
    analysis.recommendations.push("Establish automated savings transfers to ensure consistency in building reserves.");
  
    return analysis;
  }
  
  /**
   * Analyze debt structure and provide repayment strategy
   */
  function analyzeDebt(debt: Debt, income: Income): DebtAnalysis {
    const analysis: DebtAnalysis = {
      insights: [],
      recommendations: [],
      repaymentPriority: []
    };
  
    // Skip if no debt
    if (!debt || debt.total === 0) {
      analysis.insights.push("You currently have no debt, which is an excellent financial position.");
      analysis.recommendations.push("Maintain debt-free status while focusing on building assets.");
      return analysis;
    }
  
    // Calculate debt metrics
    const totalDebt = debt.total || 0;
    const totalIncome = income.total || 0;
    const debtToIncomeRatio = totalIncome > 0 ? (totalDebt / totalIncome) * 100 : 0;
  
    // Create debt list sorted by interest rate
    const debtItems: { type: string; amount: number; interestRate: number }[] = [];
    for (const [key, value] of Object.entries(debt)) {
      if (key !== "total" && (value as DebtDetail).amount > 0) {
        debtItems.push({
          type: key,
          amount: (value as DebtDetail).amount,
          interestRate: (value as DebtDetail).interestRate
        });
      }
    }
  
    // Sort debts by interest rate (highest first)
    debtItems.sort((a, b) => b.interestRate - a.interestRate);
  
    // Generate debt insights
    analysis.insights.push(
      `Your debt-to-income ratio is ${debtToIncomeRatio.toFixed(
        1
      )}%, which is ${debtToIncomeRatio > 36 ? "above the recommended maximum of 36%" : "within acceptable limits"}.`
    );
  
    // Analyze individual debt types
    if (debt.creditCard && debt.creditCard.amount > 0) {
      analysis.insights.push(
        `Credit card debt (${formatCurrency(debt.creditCard.amount)}) at ${debt.creditCard.interestRate}% interest is costing approximately ${formatCurrency(
          (debt.creditCard.amount * debt.creditCard.interestRate) / 100
        )} annually in interest.`
      );
      analysis.repaymentPriority?.push("Credit card debt should be your highest priority for repayment due to high interest rates.");
    }
  
    if (debt.mortgage && debt.mortgage.amount > 0) {
      const mortgageIncomeRatio = totalIncome > 0 ? (debt.mortgage.amount / totalIncome) * 100 : 0;
      analysis.insights.push(
        `Mortgage debt represents ${mortgageIncomeRatio.toFixed(1)}% of annual income with an interest rate of ${debt.mortgage.interestRate}%.`
      );
    }
  
    if (debt.student && debt.student.amount > 0) {
      analysis.insights.push(
        `Student loan debt (${formatCurrency(debt.student.amount)}) has moderate interest rate (${debt.student.interestRate}%) but potential tax advantages.`
      );
    }
  
    // Generate debt repayment strategy
    if (debtItems.length > 0) {
      analysis.recommendations.push("Focus on paying off debts in order of highest interest rate first while maintaining minimum payments on all debts.");
      // Add repayment priority list
      debtItems.forEach((item, index) => {
        analysis.repaymentPriority?.push(
          `${index + 1}. ${capitalizeFirstLetter(item.type)} debt: ${formatCurrency(item.amount)} at ${item.interestRate}% interest`
        );
      });
    }
  
    if (debtToIncomeRatio > 36) {
      analysis.recommendations.push("Consider debt consolidation or refinancing options to reduce interest costs.");
      analysis.recommendations.push("Avoid taking on additional debt until ratio improves to below 36%.");
    }
  
    return analysis;
  }
  
  /**
   * Analyze investment portfolio and provide allocation insights
   */
  function analyzeInvestments(investments: Investments, personal: Personal): InvestmentAnalysis {
    const analysis: InvestmentAnalysis = {
      insights: [],
      recommendations: [],
      allocationAnalysis: {}
    };
  
    // Skip if no investments
    if (!investments || investments.total === 0) {
      analysis.insights.push("No investment portfolio detected.");
      analysis.recommendations.push("Begin investing with low-cost index funds to build long-term wealth.");
      analysis.recommendations.push("Consider consulting with a financial advisor to establish an appropriate investment strategy.");
      return analysis;
    }
  
    // Calculate investment metrics
    const totalInvestments = investments.total || 0;
    const investmentCategories: { category: string; amount: number; percentage: number }[] = [];
    let largestCategory = { name: "", amount: 0 };
  
    // Analyze allocation
    Object.entries(investments).forEach(([key, value]) => {
      if (key !== "total" && value > 0) {
        const percentage = (value / totalInvestments) * 100;
        investmentCategories.push({
          category: key,
          amount: value,
          percentage
        });
  
        if (value > largestCategory.amount) {
          largestCategory = { name: key, amount: value };
        }
  
        // Add to allocation analysis
        analysis.allocationAnalysis[key] = {
          amount: value,
          percentage: percentage.toFixed(1) + "%"
        };
      }
    });
  
    // Sort investment categories by percentage (highest first)
    investmentCategories.sort((a, b) => b.percentage - a.percentage);
  
    // Generate investment insights
    analysis.insights.push(
      `Your investment portfolio totals ${formatCurrency(totalInvestments)} across ${investmentCategories.length} asset classes.`
    );
  
    if (investmentCategories.length >= 3) {
      analysis.insights.push("Portfolio shows healthy diversification across multiple asset classes.");
    } else {
      analysis.insights.push("Portfolio has limited diversification which may increase investment risk.");
      analysis.recommendations.push("Consider adding exposure to additional asset classes to improve diversification.");
    }
  
    // Calculate concentration risk
    if (largestCategory.amount > 0 && largestCategory.amount / totalInvestments > 0.5) {
      analysis.insights.push(
        `${capitalizeFirstLetter(largestCategory.name)} represents ${((largestCategory.amount / totalInvestments) * 100).toFixed(
          1
        )}% of your portfolio, indicating concentration risk.`
      );
      analysis.recommendations.push(
        `Consider rebalancing to reduce ${largestCategory.name} concentration and improve diversification.`
      );
    }
  
    // Add age-based investment recommendations
    if (personal.age < 40) {
      analysis.recommendations.push("Given your age profile, consider a growth-oriented allocation with higher equity exposure.");
    } else if (personal.age < 55) {
      analysis.recommendations.push("Consider a balanced approach with a mix of growth and income investments appropriate for your mid-life stage.");
    } else {
      analysis.recommendations.push("Your age profile suggests focusing on preservation and income generation with appropriate risk reduction.");
    }
  
    // Add investment recommendations
    analysis.recommendations.push("Review investment fees to ensure they're not eroding returns unnecessarily.");
    analysis.recommendations.push("Establish regular portfolio review schedule (quarterly or semi-annually) to maintain appropriate allocations.");
  
    return analysis;
  }
  
  /**
   * Analyze financial goals and provide achievement strategies
   */
  function analyzeFinancialGoals(goals: Goals, financial: Financial): GoalAnalysis {
    const analysis: GoalAnalysis = {
      insights: [],
      recommendations: []
    };
  
    // Check if goals are defined
    const hasDefinedGoals =
      goals.shortTerm.amount > 0 || goals.mediumTerm.amount > 0 || goals.longTerm.amount > 0;
  
    if (!hasDefinedGoals) {
      analysis.insights.push("No specific financial goals have been defined.");
      analysis.recommendations.push("Establish clear short-term (1-2 years), medium-term (3-5 years), and long-term (5+ years) financial goals.");
      analysis.recommendations.push("Consider goals related to debt reduction, major purchases, education funding, and retirement planning.");
      return analysis;
    }
  
    // Calculate metrics for goal feasibility
    const monthlyIncome = (financial.income.total || 0) / 12;
    const monthlyExpenses = (financial.expenses.total || 0) / 12;
    const monthlySurplus = monthlyIncome - monthlyExpenses;
  
    analysis.goalFeasibility = {};
  
    // Analyze each goal
    if (goals.shortTerm.amount > 0) {
      const shortTermMonthlyTarget = goals.shortTerm.amount / (goals.shortTerm.timeline * 12);
      const shortTermFeasibility = monthlySurplus > 0 ? (shortTermMonthlyTarget / monthlySurplus) * 100 : 0;
  
      analysis.insights.push(
        `Short-term goal of ${formatCurrency(goals.shortTerm.amount)} in ${goals.shortTerm.timeline} year(s) requires approximately ${formatCurrency(
          shortTermMonthlyTarget
        )} monthly savings.`
      );
  
      analysis.goalFeasibility.shortTerm = {
        goalAmount: goals.shortTerm.amount,
        timeline: goals.shortTerm.timeline,
        monthlyRequired: shortTermMonthlyTarget,
        feasibility: shortTermFeasibility <= 100 ? "Achievable" : "Challenging"
      };
  
      if (shortTermFeasibility > 100) {
        analysis.recommendations.push("Adjust short-term goal timeline or amount to align with financial capacity.");
      }
    }
  
    if (goals.mediumTerm.amount > 0) {
      const mediumTermMonthlyTarget = goals.mediumTerm.amount / (goals.mediumTerm.timeline * 12);
      const mediumTermFeasibility = monthlySurplus > 0 ? (mediumTermMonthlyTarget / monthlySurplus) * 100 : 0;
  
      analysis.insights.push(
        `Medium-term goal of ${formatCurrency(goals.mediumTerm.amount)} in ${goals.mediumTerm.timeline} year(s) requires approximately ${formatCurrency(
          mediumTermMonthlyTarget
        )} monthly savings.`
      );
  
      analysis.goalFeasibility.mediumTerm = {
        goalAmount: goals.mediumTerm.amount,
        timeline: goals.mediumTerm.timeline,
        monthlyRequired: mediumTermMonthlyTarget,
        feasibility: mediumTermFeasibility <= 100 ? "Achievable" : "Challenging"
      };
  
      if (mediumTermFeasibility > 100) {
        analysis.recommendations.push("Consider investment acceleration strategies to reach medium-term goals.");
      }
    }
  
    if (goals.longTerm.amount > 0) {
      const longTermMonthlyTarget = goals.longTerm.amount / (goals.longTerm.timeline * 12);
      const longTermFeasibility = monthlySurplus > 0 ? (longTermMonthlyTarget / monthlySurplus) * 100 : 0;
  
      analysis.insights.push(
        `Long-term goal of ${formatCurrency(goals.longTerm.amount)} in ${goals.longTerm.timeline} year(s) requires approximately ${formatCurrency(
          longTermMonthlyTarget
        )} monthly savings.`
      );
  
      analysis.goalFeasibility.longTerm = {
        goalAmount: goals.longTerm.amount,
        timeline: goals.longTerm.timeline,
        monthlyRequired: longTermMonthlyTarget,
        feasibility: longTermFeasibility <= 100 ? "Achievable with investment growth" : "Requires strategy adjustment"
      };
  
      if (longTermFeasibility > 100) {
        analysis.recommendations.push("Long-term goal may require increased income or investment return strategies.");
      }
    }
  
    // General goal recommendations
    analysis.recommendations.push("Create dedicated savings accounts for each financial goal to track progress.");
    analysis.recommendations.push("Review goals quarterly to ensure continued alignment with life plans and financial capacity.");
  
    return analysis;
  }
  
  /**
   * Generate prioritized recommendations across all financial areas
   */
  function generatePrioritizedRecommendations(
    results: ComprehensiveInsights,
    personal: Personal,
    financial: Financial,
    metrics: Metrics
  ): string[] {
    const allRecommendations: string[] = [];
    const highPriority: string[] = [];
    const mediumPriority: string[] = [];
    const longTermPriority: string[] = [];
  
    // High priority recommendations (financial safety)
    if (!financial.savings.emergency || financial.savings.emergency < financial.expenses.total / 4) {
      highPriority.push("Establish emergency fund with 3-6 months of essential expenses.");
    }
  
    if (financial.debt.creditCard && financial.debt.creditCard.amount > 0) {
      highPriority.push("Pay down high-interest credit card debt as top priority.");
    }
  
    if (metrics.debtToIncomeRatio > 50) {
      highPriority.push("Reduce debt-to-income ratio to improve financial stability.");
    }
  
    // Medium priority recommendations (optimization)
    if (metrics.savingsRate < 20) {
      mediumPriority.push("Increase savings rate to at least 20% through expense reduction or income growth.");
    }
  
    if (financial.income.total > 0 && financial.income.other === 0) {
      mediumPriority.push("Develop additional income streams to improve financial security.");
    }
  
    if (!financial.savings.retirement || financial.savings.retirement === 0) {
      mediumPriority.push("Begin retirement savings contributions, even if starting with small amounts.");
    }
  
    // Long-term recommendations (wealth building)
    if (!financial.investments.total || financial.investments.total === 0) {
      longTermPriority.push("Start investment strategy aligned with your age and risk tolerance.");
    } else if (
      financial.investments.total > 0 &&
      Object.keys(financial.investments).filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        k => k !== "total" && (financial.investments as any)[k] > 0
      ).length < 3
    ) {
      longTermPriority.push("Improve investment diversification across multiple asset classes.");
    }
  
    if (
      !financial.goals.shortTerm.amount &&
      !financial.goals.mediumTerm.amount &&
      !financial.goals.longTerm.amount
    ) {
      longTermPriority.push("Establish specific financial goals to guide saving and investment decisions.");
    }
  
    // Collect all recommendations from analysis sections
    Object.values(results).forEach(section => {
      // Each section that is an object with recommendations
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((section as any).recommendations && Array.isArray((section as any).recommendations)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ((section as any).recommendations as string[]).forEach(rec => {
          // Avoid duplicates
          if (
            !allRecommendations.includes(rec) &&
            !highPriority.includes(rec) &&
            !mediumPriority.includes(rec) &&
            !longTermPriority.includes(rec)
          ) {
            allRecommendations.push(rec);
          }
        });
      }
    });
  
    // Combine all recommendations with prioritization
    return [
      "🔴 IMMEDIATE ACTION ITEMS:",
      ...highPriority,
      "",
      "🟠 NEXT STEPS:",
      ...mediumPriority,
      "",
      "🟢 LONG-TERM OPTIMIZATION:",
      ...longTermPriority,
      "",
      "ADDITIONAL RECOMMENDATIONS:",
      ...allRecommendations
    ];
  }
  
  /**
   * Helper function to format currency values
   */
  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount);
  }
  
  /**
   * Helper function to capitalize first letter
   */
  function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  /**
   * Helper function to determine income percentile based on location
   * Note: This is simplified and would need real data in production
   */
  function determineIncomePercentile(income: number, city: string): string {
  
    // Simplified monthly income brackets based on city.
    // These values are derived by dividing the original yearly thresholds by 12.
    const cityIncomeBrackets: { [key: string]: { high: number; medium: number; low: number } } = {
      mumbai: {
        high: 1000000 / 12,    // ≈ 83,333 per month
        medium: 500000 / 12,   // ≈ 41,667 per month
        low: 200000 / 12       // ≈ 16,667 per month
      },
      delhi: {
        high: 900000 / 12,     // ≈ 75,000 per month
        medium: 450000 / 12,   // ≈ 37,500 per month
        low: 180000 / 12       // ≈ 15,000 per month
      },
      bangalore: {
        high: 1100000 / 12,    // ≈ 91,667 per month
        medium: 550000 / 12,   // ≈ 45,833 per month
        low: 220000 / 12       // ≈ 18,333 per month
      },
      default: {
        high: 800000 / 12,     // ≈ 66,667 per month
        medium: 400000 / 12,   // ≈ 33,333 per month
        low: 160000 / 12       // ≈ 13,333 per month
      }
    };
  
    // Get brackets for specified city or use default
    const brackets = cityIncomeBrackets[city.toLowerCase()] || cityIncomeBrackets["default"];
  
    // Determine income bracket based on monthly income
    if (income >= brackets.high) {
      return "the upper";
    } else if (income >= brackets.medium) {
      return "the middle-upper";
    } else if (income >= brackets.low) {
      return "the middle";
    } else {
      return "the lower-middle";
    }
  }
  
  
  // Example usage with sample data:
  // const sampleData: Data = { ... };
  // const analysisResult = generateComprehensiveFinancialInsights(sampleData);
  // console.log(JSON.stringify(analysisResult, null, 2));
  