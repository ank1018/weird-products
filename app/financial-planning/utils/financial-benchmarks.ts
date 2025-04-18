// financial-benchmarks.ts - Add these functions to your project

/**
 * Determines income percentile based on monthly income in India
 * Data is approximate based on income distribution in India
 * @param monthlyIncome Monthly income in INR
 * @returns Percentile ranking (e.g., "top 10%")
 */
export const getIncomeBracket = (monthlyIncome: number): string => {
    // Income brackets in INR (monthly)
    if (monthlyIncome > 200000) return "top 1%";
    if (monthlyIncome > 100000) return "top 5%";
    if (monthlyIncome > 60000) return "top 10%";
    if (monthlyIncome > 45000) return "top 20%";
    if (monthlyIncome > 30000) return "top 30%";
    if (monthlyIncome > 20000) return "top 50%";
    return "bottom 50%";
  };
  
  /**
   * Calculates spending efficiency compared to average household spending
   * @param monthlyIncome Monthly income
   * @param monthlyExpenses Monthly expenses
   * @returns Percentage of average spending for similar income bracket
   */
  export const getSpendingEfficiency = (monthlyIncome: number, monthlyExpenses: number): number => {
    // Typical expense ratios based on income brackets
    // Format: [minIncome, expectedExpenseRatio]
    const expenseRatios: [number, number][] = [
      [150000, 0.50], // >150k income typically spends 50% of income
      [100000, 0.60], // 100k-150k income typically spends 60% of income
      [60000, 0.70],  // 60k-100k income typically spends 70% of income
      [30000, 0.80],  // 30k-60k income typically spends 80% of income
      [0, 0.90],      // <30k income typically spends 90% of income
    ];
    
    // Find the appropriate ratio for this income level
    const ratio = expenseRatios.find(([minIncome]) => monthlyIncome >= minIncome)?.[1] || 0.80;
    
    // Calculate expected expenses for this income level
    const expectedExpenses = monthlyIncome * ratio;
    
    // Calculate efficiency (actual expenses compared to expected)
    // Lower percentage means more efficient spending
    return (monthlyExpenses / expectedExpenses) * 100;
  };
  
  /**
   * Evaluates savings rate against recommended targets
   * @param savingsRate Savings rate as decimal (e.g., 0.15 for 15%)
   * @returns Object with assessment and recommendation
   */
  export const evaluateSavingsRate = (savingsRate: number): { status: string; message: string } => {
    if (savingsRate >= 0.30) {
      return {
        status: "excellent",
        message: "Excellent! Above 30% target"
      };
    } else if (savingsRate >= 0.20) {
      return {
        status: "good",
        message: "Good! Above 20% recommended"
      };
    } else if (savingsRate >= 0.15) {
      return {
        status: "fair",
        message: "Fair. Approaching 20% target"
      };
    } else if (savingsRate >= 0.10) {
      return {
        status: "needs-improvement",
        message: "Below 20% recommendation"
      };
    } else {
      return {
        status: "critical",
        message: "Well below 20% target"
      };
    }
  };
  
  /**
   * Evaluates debt-to-income ratio health
   * @param debtToIncomeRatio Debt-to-income ratio as decimal (e.g., 0.32 for 32%)
   * @returns Object with assessment and recommendation
   */
  export const evaluateDebtToIncome = (debtToIncomeRatio: number): { status: string; message: string } => {
    if (debtToIncomeRatio <= 0.28) {
      return {
        status: "excellent",
        message: "Excellent debt management"
      };
    } else if (debtToIncomeRatio <= 0.36) {
      return {
        status: "good",
        message: "Within healthy range (<36%)"
      };
    } else if (debtToIncomeRatio <= 0.42) {
      return {
        status: "fair",
        message: "Approaching high DTI (42%)"
      };
    } else if (debtToIncomeRatio <= 0.50) {
      return {
        status: "warning",
        message: "High DTI ratio, reduce debt"
      };
    } else {
      return {
        status: "critical",
        message: "Critical DTI ratio (>50%)"
      };
    }
  };
  
  /**
   * Estimates retirement readiness based on age and savings
   * @param age Current age
   * @param monthlySavingsRate Savings rate as decimal
   * @param totalRetirementSavings Total retirement savings so far
   * @param monthlyIncome Monthly income
   * @returns Retirement readiness assessment
   */
  export const getRetirementReadiness = (
    age: number,
    monthlySavingsRate: number,
    totalRetirementSavings: number,
    monthlyIncome: number
  ): string => {
    // Annual income
    const annualIncome = monthlyIncome * 12;
    
    // Simple benchmark: By age 30, should have 1x annual income saved
    // By 40: 3x, By 50: 6x, By 60: 10x
    const targetMultiplier = age <= 30 ? 1 :
                            age <= 40 ? 1 + (age - 30) * 0.2 :
                            age <= 50 ? 3 + (age - 40) * 0.3 :
                            age <= 60 ? 6 + (age - 50) * 0.4 : 10;
    
    const targetSavings = annualIncome * targetMultiplier;
    const savingsRatio = totalRetirementSavings / targetSavings;
    
    if (savingsRatio >= 1.2) {
      return "On track for comfortable retirement";
    } else if (savingsRatio >= 0.9) {
      return "Near retirement savings targets";
    } else if (savingsRatio >= 0.6) {
      return "Building toward retirement targets";
    } else {
      return "Below recommended retirement savings";
    }
  };