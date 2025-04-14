"use client";
import React, { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Target,
  Calculator,
  Lightbulb,
  LineChart as LineChartIcon,
  User,
  Brain,
} from "lucide-react";
import "../styles/financial-planning.css";
import NavBarView from "../../nav-bar/nav-bar.view";
import GoogleAd from "../../google-ads/google-ads.view";
import Footer from "../../footer/footer.view";
import BudgetTab from "./budget-tab";
import OverviewTab from "./overview-tab";
import InvestmentsTab from "./investment-tab";
import DebtTab from "./debt-tab";
import GoalsTab from "./goals-tab";
import ProjectionsTab from "./projection-tab";
import PersonalTab from "./personal-tab";
import AiInsightsTab from "./ai-insight-tab";

interface FinancialData {
  income: {
    salary: number;
    other: number;
    total: number;
  };
  expenses: {
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
  };
  savings: {
    emergency: number;
    retirement: number;
    investment: number;
    other: number;
    total: number;
  };
  investments: {
    stocks: number;
    bonds: number;
    realEstate: number;
    mutualFunds: number;
    crypto: number;
    other: number;
    total: number;
  };
  debt: {
    mortgage: { amount: number; interestRate: number };
    car: { amount: number; interestRate: number };
    student: { amount: number; interestRate: number };
    creditCard: { amount: number; interestRate: number };
    personal: { amount: number; interestRate: number };
    other: { amount: number; interestRate: number };
    total: number;
  };
  goals: {
    shortTerm: {
      amount: number;
      timeline: number;
      description: string;
    };
    mediumTerm: {
      amount: number;
      timeline: number;
      description: string;
    };
    longTerm: {
      amount: number;
      timeline: number;
      description: string;
    };
  };
}

// Update the PersonalInfo interface
interface PersonalInfo {
  age: number;
  employmentStatus: "employed" | "self-employed" | "retired" | "student" | "other";
  maritalStatus: "single" | "married" | "divorced" | "widowed";
  dependents: number;
  city: string;
}

// Add AI Insights state and types
interface AIInsights {
  loading: boolean;
  error: string | null;
  insights: string[];
  source: 'cohere' | 'openrouter' | 'fallback';
}

const FinancialPlanning = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [financialData, setFinancialData] = useState<FinancialData>(() => {
    // Load initial state from localStorage
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('financialData');
      if (savedData) {
        return JSON.parse(savedData);
      }
    }
    // Default state if no saved data
    return {
      income: {
        salary: 0,
        other: 0,
        total: 0,
      },
      expenses: {
        housing: 0,
        transportation: 0,
        food: 0,
        utilities: 0,
        entertainment: 0,
        healthcare: 0,
        education: 0,
        debt: 0,
        other: 0,
        total: 0,
      },
      savings: {
        emergency: 0,
        retirement: 0,
        investment: 0,
        other: 0,
        total: 0,
      },
      investments: {
        stocks: 0,
        bonds: 0,
        realEstate: 0,
        mutualFunds: 0,
        crypto: 0,
        other: 0,
        total: 0,
      },
      debt: {
        mortgage: { amount: 0, interestRate: 8.2 },
        car: { amount: 0, interestRate: 8.9 },
        student: { amount: 0, interestRate: 7.5 },
        creditCard: { amount: 0, interestRate: 18.0 },
        personal: { amount: 0, interestRate: 12.5 },
        other: { amount: 0, interestRate: 10.0 },
        total: 0,
      },
      goals: {
        shortTerm: {
          amount: 0,
          timeline: 1,
          description: "",
        },
        mediumTerm: {
          amount: 0,
          timeline: 5,
          description: "",
        },
        longTerm: {
          amount: 0,
          timeline: 10,
          description: "",
        },
      },
    };
  });

  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [savingsRate, setSavingsRate] = useState(0);
  const [debtToIncomeRatio, setDebtToIncomeRatio] = useState(0);
  const [retirementAge, setRetirementAge] = useState(65);
  const [retirementSavings] = useState(0);
  const [financialHealthScore, setFinancialHealthScore] = useState(0);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [riskProfile, setRiskProfile] = useState<"Conservative" | "Moderate" | "Aggressive">("Moderate");

  // Add a new state to track focused inputs
  const [focusedInputs, setFocusedInputs] = useState<Record<string, boolean>>({});

  // Update the personal info state initialization
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(() => {
    if (typeof window !== 'undefined') {
      const savedInfo = localStorage.getItem('personalInfo');
      if (savedInfo) {
        return JSON.parse(savedInfo);
      }
    }
    return {
      age: 0,
      employmentStatus: "employed",
      maritalStatus: "single",
      dependents: 0,
      city: ""
    };
  });

  // Add AI Insights state and types
  const [aiInsights, setAIInsights] = useState<AIInsights>({
    loading: false,
    error: null,
    insights: [],
    source: 'fallback'
  });

  // Save to localStorage whenever financialData changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('financialData', JSON.stringify(financialData));
    }
  }, [financialData]);

  // Load activeTab from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTab = localStorage.getItem('activeTab');
      if (savedTab) {
        setActiveTab(savedTab);
      }
    }
  }, []);

  // Save activeTab to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('activeTab', activeTab);
    }
  }, [activeTab]);

  // Load retirementAge from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAge = localStorage.getItem('retirementAge');
      if (savedAge) {
        setRetirementAge(Number(savedAge));
      }
    }
  }, []);

  // Save retirementAge to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('retirementAge', retirementAge.toString());
    }
  }, [retirementAge]);

  // First effect: Calculate totals and update financialData
  useEffect(() => {
    const totalIncome = (financialData.income.salary || 0) + (financialData.income.other || 0);
    const totalExpenses = Object.entries(financialData.expenses)
      .filter(([key]) => key !== 'total')
      .reduce((sum, [, value]) => sum + (value || 0), 0);
    const totalSavings = Object.entries(financialData.savings)
      .filter(([key]) => key !== 'total')
      .reduce((sum, [, value]) => sum + (value || 0), 0);
    const totalInvestments = Object.entries(financialData.investments)
      .filter(([key]) => key !== 'total')
      .reduce((sum, [, value]) => sum + (value || 0), 0);
    const totalDebt = Object.entries(financialData.debt)
      .filter(([key]) => key !== 'total')
      .reduce((sum, [, value]) => {
        const debtValue = value as { amount: number; interestRate: number };
        return sum + (debtValue.amount || 0);
      }, 0);

    setFinancialData(prev => ({
      ...prev,
      income: { ...prev.income, total: totalIncome },
      expenses: { ...prev.expenses, total: totalExpenses },
      savings: { ...prev.savings, total: totalSavings },
      investments: { ...prev.investments, total: totalInvestments },
      debt: { ...prev.debt, total: totalDebt },
    }));
  }, [
    financialData.income.salary,
    financialData.income.other,
    financialData.expenses.housing,
    financialData.expenses.transportation,
    financialData.expenses.food,
    financialData.expenses.utilities,
    financialData.expenses.entertainment,
    financialData.expenses.healthcare,
    financialData.expenses.education,
    financialData.expenses.debt,
    financialData.expenses.other,
    financialData.savings.emergency,
    financialData.savings.retirement,
    financialData.savings.investment,
    financialData.savings.other,
    financialData.investments.stocks,
    financialData.investments.bonds,
    financialData.investments.realEstate,
    financialData.investments.mutualFunds,
    financialData.investments.crypto,
    financialData.investments.other,
    financialData.debt.mortgage.amount,
    financialData.debt.car.amount,
    financialData.debt.student.amount,
    financialData.debt.creditCard.amount,
    financialData.debt.personal.amount,
    financialData.debt.other.amount
  ]);

  // Second effect: Calculate metrics and generate recommendations
  useEffect(() => {
    const totalIncome = financialData.income.total || 0;
    const totalExpenses = financialData.expenses.total || 0;
    const totalSavings = financialData.savings.total || 0;
    const totalDebt = financialData.debt.total || 0;

    const newMonthlyBudget = totalIncome - totalExpenses;
    const newSavingsRate = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0;
    const newDebtToIncomeRatio = totalIncome > 0 ? (totalDebt / totalIncome) * 100 : 0;

    const score = calculateFinancialHealthScore({
      savingsRate: newSavingsRate,
      debtToIncomeRatio: newDebtToIncomeRatio,
      emergencyFund: financialData.savings.emergency || 0,
      monthlyExpenses: totalExpenses,
      investmentDiversity: calculateInvestmentDiversity(financialData.investments),
      age: 30,
      retirementSavings: financialData.savings.retirement || 0,
    });

    const newRecommendations = generateRecommendations({
      financialData,
      financialHealthScore: score,
      monthlyBudget: newMonthlyBudget,
      savingsRate: newSavingsRate,
      debtToIncomeRatio: newDebtToIncomeRatio,
    });

    const newRiskProfile = determineRiskProfile({
      age: 30,
      investmentExperience: "Moderate",
      financialGoals: financialData.goals,
      currentInvestments: financialData.investments,
    });

    setMonthlyBudget(newMonthlyBudget);
    setSavingsRate(newSavingsRate);
    setDebtToIncomeRatio(newDebtToIncomeRatio);
    setFinancialHealthScore(score);
    setRecommendations(newRecommendations);
    setRiskProfile(newRiskProfile);
  }, [
    financialData.income.total,
    financialData.expenses.total,
    financialData.savings.total,
    financialData.debt.total,
    financialData.savings.emergency,
    financialData.savings.retirement,
    financialData.investments,
    financialData.goals
  ]);

  const calculateFinancialHealthScore = (metrics: {
    savingsRate: number;
    debtToIncomeRatio: number;
    emergencyFund: number;
    monthlyExpenses: number;
    investmentDiversity: number;
    age: number;
    retirementSavings: number;
  }) => {
    const {
      savingsRate,
      debtToIncomeRatio,
      emergencyFund,
      monthlyExpenses,
      investmentDiversity,
      age,
      retirementSavings,
    } = metrics;

    const emergencyFundScore = Math.min(100, (emergencyFund / (monthlyExpenses * 6)) * 100);
    const savingsRateScore = Math.min(100, savingsRate * 2);
    const debtScore = Math.max(0, 100 - (debtToIncomeRatio * 2));
    const investmentDiversityScore = investmentDiversity * 100;
    const retirementScore = calculateRetirementScore(age, retirementSavings, monthlyExpenses);

    return Math.round(
      (emergencyFundScore * 0.2) +
      (savingsRateScore * 0.2) +
      (debtScore * 0.2) +
      (investmentDiversityScore * 0.2) +
      (retirementScore * 0.2)
    );
  };

  const calculateInvestmentDiversity = (investments: FinancialData["investments"]) => {
    const total = investments.total;
    if (total === 0) return 0;

    const values = Object.entries(investments)
      .filter(([key]) => key !== 'total')
      .map(([, value]) => value / total);

    // Calculate diversity using Herfindahl-Hirschman Index (HHI)
    const hhi = values.reduce((sum, value) => sum + value * value, 0);
    return 1 - hhi; // Convert to diversity score (0 to 1)
  };

  const calculateRetirementScore = (age: number, retirementSavings: number, monthlyExpenses: number) => {
    const targetRetirementSavings = monthlyExpenses * 12 * 25; // 25x annual expenses
    const currentProgress = retirementSavings / targetRetirementSavings;
    return Math.min(100, currentProgress * 100);
  };

  const generateRecommendations = (data: {
    financialData: FinancialData;
    financialHealthScore: number;
    monthlyBudget: number;
    savingsRate: number;
    debtToIncomeRatio: number;
  }) => {
    const recommendations: string[] = [];

    // Emergency fund recommendations
    const emergencyFundMonths = data.financialData.savings.emergency / (data.financialData.expenses.total / 12);
    if (emergencyFundMonths < 3) {
      recommendations.push(`Build your emergency fund to cover at least 3 months of expenses (₹${Math.round(data.financialData.expenses.total * 3)}).`);
    } else if (emergencyFundMonths < 6) {
      recommendations.push(`Consider increasing your emergency fund to cover 6 months of expenses (₹${Math.round(data.financialData.expenses.total * 6)}).`);
    }

    // Debt recommendations
    if (data.debtToIncomeRatio > 40) {
      recommendations.push("Your debt-to-income ratio is high. Focus on paying down high-interest debt first.");
    } else if (data.debtToIncomeRatio > 20) {
      recommendations.push("Consider accelerating debt payments to improve your financial flexibility.");
    }

    // Investment recommendations
    const investmentDiversity = calculateInvestmentDiversity(data.financialData.investments);
    if (investmentDiversity < 0.5) {
      recommendations.push("Diversify your investment portfolio to reduce risk.");
    }

    // Retirement recommendations
    const retirementProgress = data.financialData.savings.retirement / (data.financialData.expenses.total * 12 * 25);
    if (retirementProgress < 0.5) {
      recommendations.push("Increase your retirement savings to ensure a comfortable retirement.");
    }

    // Savings recommendations
    if (data.savingsRate < 20) {
      recommendations.push("Aim to save at least 20% of your income each month.");
    }

    // Risk profile recommendations
    if (data.financialData.investments.crypto > data.financialData.investments.total * 0.1) {
      recommendations.push("Consider reducing your cryptocurrency exposure to align with your risk profile.");
    }

    return recommendations;
  };

  const determineRiskProfile = (data: {
    age: number;
    investmentExperience: string;
    financialGoals: FinancialData["goals"];
    currentInvestments: FinancialData["investments"];
  }) => {
    const { age, investmentExperience, financialGoals, currentInvestments } = data;

    let score = 50; // Base score

    // Age factor
    if (age < 30) score += 20;
    else if (age < 50) score += 10;
    else score -= 10;

    // Investment experience
    if (investmentExperience === "Advanced") score += 20;
    else if (investmentExperience === "Moderate") score += 10;
    else score -= 10;

    // Time horizon
    const avgTimeHorizon = (
      financialGoals.shortTerm.timeline +
      financialGoals.mediumTerm.timeline +
      financialGoals.longTerm.timeline
    ) / 3;
    if (avgTimeHorizon > 10) score += 20;
    else if (avgTimeHorizon > 5) score += 10;

    // Current investment risk
    const riskyInvestments = currentInvestments.crypto + currentInvestments.stocks;
    const totalInvestments = currentInvestments.total;
    if (totalInvestments > 0) {
      const riskRatio = riskyInvestments / totalInvestments;
      if (riskRatio > 0.7) score += 20;
      else if (riskRatio > 0.4) score += 10;
    }

    if (score > 80) return "Aggressive";
    if (score > 40) return "Moderate";
    return "Conservative";
  };

  const getExpenseData = () => {
    return Object.entries(financialData.expenses)
      .filter(([key]) => key !== 'total')
      .map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
      }));
  };

  const getInvestmentData = () => {
    return Object.entries(financialData.investments)
      .filter(([key]) => key !== 'total')
      .map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
      }));
  };

  const getSavingsProjection = () => {
    const months = 12;
    const data = [];
    let currentSavings = financialData.savings.total;
    const monthlyContribution = monthlyBudget * 0.2; // Assuming 20% savings rate
    const annualReturn = 0.07; // 7% annual return

    for (let i = 0; i <= months; i++) {
      data.push({
        month: i,
        savings: currentSavings,
        projection: currentSavings * Math.pow(1 + annualReturn / 12, i),
      });
      currentSavings += monthlyContribution;
    }

    return data;
  };

  // Update handleInputChange to handle focus state
  const handleInputFocus = (category: string, subCategory: string) => {
    setFocusedInputs(prev => ({
      ...prev,
      [`${category}-${subCategory}`]: true
    }));
  };

  const handleInputBlur = (category: string, subCategory: string) => {
    setFocusedInputs(prev => ({
      ...prev,
      [`${category}-${subCategory}`]: false
    }));
  };

  const getInputValue = (category: string, subCategory: string, value: number) => {
    const isFocused = focusedInputs[`${category}-${subCategory}`];
    return isFocused ? (value || '') : (value || 0);
  };

  const handleInputChange = (
    category: keyof FinancialData,
    value: number | string,
    subCategory?: string
  ) => {
    setFinancialData((prev) => {
      const newData = { ...prev };
      if (subCategory) {
        if (category === "goals") {
          const [term, field] = subCategory.split(".");
          newData.goals = {
            ...newData.goals,
            [term]: {
              ...newData.goals[term as keyof FinancialData["goals"]],
              [field]: value,
            },
          };
        } else if (category === "expenses") {
          newData.expenses = {
            ...newData.expenses,
            [subCategory]: value as number,
          };
        } else if (category === "income") {
          newData.income = {
            ...newData.income,
            [subCategory]: value as number,
          };
        } else if (category === "investments") {
          newData.investments = {
            ...newData.investments,
            [subCategory]: value as number,
          };
        } else if (category === "debt") {
          // Handle debt updates with nested structure
          const [debtType, field] = subCategory.split(".");
          if (debtType && field) {
            const debtTypeKey = debtType as keyof FinancialData["debt"];
            const debtValue = newData.debt[debtTypeKey] as { amount: number; interestRate: number };

            newData.debt = {
              ...newData.debt,
              [debtTypeKey]: {
                ...debtValue,
                [field]: value as number,
              },
            };
          }
        } else if (category === "savings") {
          newData.savings = {
            ...newData.savings,
            [subCategory]: value as number,
          };
        }
      }
      return newData;
    });
  };

  const handleGoalDescriptionChange = (term: keyof FinancialData["goals"], description: string) => {
    setFinancialData(prev => ({
      ...prev,
      goals: {
        ...prev.goals,
        [term]: {
          ...prev.goals[term],
          description
        }
      }
    }));
  };

  // Update the formatCurrency function to use Indian Rupee
  const formatCurrency = (value: number | undefined | null): string => {
    if (value === undefined || value === null || isNaN(value)) {
      return "₹0";
    }
    return `₹${value.toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  };

  // Update the formatPercentage function to handle NaN values
  const formatPercentage = (value: number | undefined | null): string => {
    if (value === undefined || value === null || isNaN(value)) {
      return "0%";
    }
    return `${value.toFixed(1)}%`;
  };

  // Add type-safe formatter for chart tooltips
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatChartValue = (value: any): string => {
    const numValue = typeof value === 'number' ? value : 0;
    return formatCurrency(numValue);
  };

  // Save personal info to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('personalInfo', JSON.stringify(personalInfo));
    }
  }, [personalInfo]);



  // Add function to check if all required data is filled
  const isDataComplete = (): boolean => {
    return Boolean(
      personalInfo.age > 0 &&
      personalInfo.city &&
      financialData.income.total > 0 &&
      financialData.expenses.total > 0 &&
      financialData.debt.total >= 0 &&
      financialData.savings.total >= 0 &&
      financialData.investments.total >= 0
    );
  };

  // Add function to get AI insights
  // financial-planning.tsx - Updated getAIInsights function
  const getAIInsights = async () => {
    if (!isDataComplete()) {
      setAIInsights({
        loading: false,
        error: "Please complete all required information in other tabs to get AI insights",
        insights: [],
        source: 'fallback'
      });
      return;
    }

    setAIInsights(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Prepare the data for AI analysis
      const analysisData = {
        personal: personalInfo,
        financial: {
          income: financialData.income,
          expenses: financialData.expenses,
          debt: financialData.debt,
          savings: financialData.savings,
          investments: financialData.investments,
          goals: financialData.goals
        },
        metrics: {
          savingsRate,
          debtToIncomeRatio,
          financialHealthScore
        }
      };

      // Call our internal API route
      const response = await fetch('/api/finance-ai-insight', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(analysisData)
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();

      // Use the insights from the API response
      setAIInsights({
        loading: false,
        error: null,
        insights: data.insights,
        source: data.source
      });

    } catch (error) {
      console.error('Error getting AI insights:', error);
      setAIInsights({
        loading: false,
        error: "Failed to generate insights. Please try again later.",
        insights: [],
        source: 'fallback'
      });
    }
  };

  return (
    <div className="financial-planning-container">
      <NavBarView />
      <div className="financial-planning-content">
        <h1 className="financial-planning-title">Financial Planning Dashboard</h1>

        {/* Financial Health Score */}
        <div className="health-score-card">
          <div className="score-circle">
            <span className="score-value">{financialHealthScore}</span>
            <span className="score-label">Financial Health Score</span>
          </div>
          <div className="risk-profile">
            <span className="risk-label">Risk Profile:</span>
            <span className={`risk-value ${riskProfile.toLowerCase()}`}>{riskProfile}</span>
          </div>
          <div className="recommendations-list">
            <h3>Key Recommendations</h3>
            <ul>
              {recommendations.slice(0, 3).map((rec, index) => (
                <li key={index}>
                  <Lightbulb size={16} />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="tabs-container">
          <button
            className={`tab ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <DollarSign size={20} /> Overview
          </button>
          <button
            className={`tab ${activeTab === "personal" ? "active" : ""}`}
            onClick={() => setActiveTab("personal")}
          >
            <User size={20} /> Personal
          </button>
          <button
            className={`tab ${activeTab === "budget" ? "active" : ""}`}
            onClick={() => setActiveTab("budget")}
          >
            <Calculator size={20} /> Budget
          </button>
          <button
            className={`tab ${activeTab === "investments" ? "active" : ""}`}
            onClick={() => setActiveTab("investments")}
          >
            <TrendingUp size={20} /> Investments
          </button>
          <button
            className={`tab ${activeTab === "debt" ? "active" : ""}`}
            onClick={() => setActiveTab("debt")}
          >
            <CreditCard size={20} /> Debt
          </button>
          <button
            className={`tab ${activeTab === "goals" ? "active" : ""}`}
            onClick={() => setActiveTab("goals")}
          >
            <Target size={20} /> Goals
          </button>
          <button
            className={`tab ${activeTab === "projections" ? "active" : ""}`}
            onClick={() => setActiveTab("projections")}
          >
            <LineChartIcon size={20} /> Projections
          </button>
          <button
            className={`tab ${activeTab === "ai-insights" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("ai-insights");
              getAIInsights();
            }}
          >
            <Brain size={20} /> AI Insights
          </button>
        </div>

        {/* Content Sections */}
        <div className="content-section">
          {activeTab === "overview" && (
            <OverviewTab
              financialData={financialData}
              formatCurrency={formatCurrency}
              formatPercentage={formatPercentage}
              savingsRate={savingsRate}
              debtToIncomeRatio={debtToIncomeRatio}
              financialHealthScore={financialHealthScore}
              recommendations={recommendations}
              riskProfile={riskProfile}
            />
          )}

          {activeTab === "budget" && (
            <BudgetTab
              financialData={financialData}
              getExpenseData={getExpenseData}
              formatCurrency={formatCurrency}
              formatChartValue={formatChartValue}
              getInputValue={getInputValue}
              handleInputChange={handleInputChange}
              handleInputFocus={handleInputFocus}
              handleInputBlur={handleInputBlur}
            />
          )}

          {activeTab === "investments" && (
            <InvestmentsTab
              financialData={financialData}
              getInvestmentData={getInvestmentData}
              formatCurrency={formatCurrency}
              formatChartValue={formatChartValue}
              getInputValue={getInputValue}
              handleInputChange={handleInputChange}
              handleInputFocus={handleInputFocus}
              handleInputBlur={handleInputBlur}
            />
          )}

          {activeTab === "debt" && (
            <DebtTab
              financialData={financialData}
              formatChartValue={formatChartValue}
              getInputValue={getInputValue}
              handleInputChange={handleInputChange}
              handleInputFocus={handleInputFocus}
              handleInputBlur={handleInputBlur}
            />
          )}

          {activeTab === "goals" && (
            <GoalsTab
              financialData={financialData}
              formatChartValue={formatChartValue}
              getInputValue={getInputValue}
              handleInputChange={handleInputChange}
              handleInputFocus={handleInputFocus}
              handleInputBlur={handleInputBlur}
              handleGoalDescriptionChange={handleGoalDescriptionChange}
            />
          )}

          {activeTab === "projections" && (
            <ProjectionsTab
              getSavingsProjection={getSavingsProjection}
              formatChartValue={formatChartValue}
              formatCurrency={formatCurrency}
              retirementAge={retirementAge}
              retirementSavings={retirementSavings}
              financialData={financialData}
            />
          )}

          {activeTab === "personal" && (
            <PersonalTab
              personalInfo={personalInfo}
              getInputValue={getInputValue}
              handleInputFocus={handleInputFocus}
              handleInputBlur={handleInputBlur}
              setPersonalInfo={setPersonalInfo}
            />
          )}

          {activeTab === "ai-insights" && (
            <AiInsightsTab
              isDataComplete={isDataComplete}
              aiInsights={aiInsights}
              getAIInsights={getAIInsights}
            />
          )}
        </div>
      </div>
      <GoogleAd slot={"4077644091"} className="ad-bottom" />
      <Footer />
      <style jsx>{`
        
      `}</style>
    </div>
  );
};

export default FinancialPlanning; 