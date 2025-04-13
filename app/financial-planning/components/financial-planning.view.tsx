"use client";
import React, { useState, useEffect } from "react";
import {
  PieChart,
  BarChart,
  LineChart,
  DollarSign,
  TrendingUp,
  CreditCard,
  PiggyBank,
  Target,
  Calculator,
  Settings,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  Info,
  Lightbulb,
  Shield,
  Clock,
  Calendar,
  Wallet,
  Home,
  Car,
  GraduationCap,
  CreditCard as CreditCardIcon,
  Heart,
  Plane,
  Gift,
  Building2,
  Coins,
  Gem,
  Banknote,
  Landmark,
  LineChart as LineChartIcon,
  BarChart2,
  PieChart as PieChartIcon,
  User,
  CheckCircle,
} from "lucide-react";
import "../styles/financial-planning.css";
import NavBarView from "../../nav-bar/nav-bar.view";
import GoogleAd from "../../google-ads/google-ads.view";
import Footer from "../../footer/footer.view";
import {
  ResponsiveContainer,
  Pie,
  Cell,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
} from "recharts";

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
    mortgage: number;
    car: number;
    student: number;
    creditCard: number;
    personal: number;
    other: number;
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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

// Update the PersonalInfo interface
interface PersonalInfo {
  age: number;
  employmentStatus: "employed" | "self-employed" | "retired" | "student" | "other";
  maritalStatus: "single" | "married" | "divorced" | "widowed";
  dependents: number;
  city: string;
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
        mortgage: 0,
        car: 0,
        student: 0,
        creditCard: 0,
        personal: 0,
        other: 0,
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
  const [retirementSavings, setRetirementSavings] = useState(0);
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
      .reduce((sum, [_, value]) => sum + (value || 0), 0);
    const totalSavings = Object.entries(financialData.savings)
      .filter(([key]) => key !== 'total')
      .reduce((sum, [_, value]) => sum + (value || 0), 0);
    const totalInvestments = Object.entries(financialData.investments)
      .filter(([key]) => key !== 'total')
      .reduce((sum, [_, value]) => sum + (value || 0), 0);
    const totalDebt = Object.entries(financialData.debt)
      .filter(([key]) => key !== 'total')
      .reduce((sum, [_, value]) => sum + (value || 0), 0);

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
    financialData.debt.mortgage,
    financialData.debt.car,
    financialData.debt.student,
    financialData.debt.creditCard,
    financialData.debt.personal,
    financialData.debt.other
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
      .map(([_, value]) => value / total);

    // Calculate diversity using Herfindahl-Hirschman Index (HHI)
    const hhi = values.reduce((sum, value) => sum + value * value, 0);
    return 1 - hhi; // Convert to diversity score (0 to 1)
  };

  const calculateRetirementScore = (age: number, retirementSavings: number, monthlyExpenses: number) => {
    const yearsToRetirement = 65 - age;
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

  const getDebtData = () => {
    return Object.entries(financialData.debt)
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
    subCategory?: keyof FinancialData["expenses"] | keyof FinancialData["goals"] | keyof FinancialData["income"]
  ) => {
    setFinancialData((prev) => {
      const newData = { ...prev };
      if (subCategory) {
        if (category === "goals") {
          const [term, field] = (subCategory as string).split(".");
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
          newData.debt = {
            ...newData.debt,
            [subCategory]: value as number,
          };
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

  const calculateRetirementSavings = () => {
    const yearsToRetirement = retirementAge - new Date().getFullYear();
    const annualSavings = financialData.savings.total * 12;
    const investmentReturn = 0.07; // 7% average annual return
    let total = 0;

    for (let i = 0; i < yearsToRetirement; i++) {
      total = (total + annualSavings) * (1 + investmentReturn);
    }

    setRetirementSavings(total);
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

  // Update the formatNumber function to handle NaN values
  const formatNumber = (value: number | undefined | null): string => {
    if (value === undefined || value === null || isNaN(value)) {
      return "0";
    }
    return value.toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  // Update the formatPercentage function to handle NaN values
  const formatPercentage = (value: number | undefined | null): string => {
    if (value === undefined || value === null || isNaN(value)) {
      return "0%";
    }
    return `${value.toFixed(1)}%`;
  };

  // Add type-safe formatter for chart tooltips
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

  // Add debt strategy calculation function
  const calculateDebtStrategy = () => {
    const totalDebt = financialData.debt.total;
    const totalIncome = financialData.income.total;
    const monthlyExpenses = financialData.expenses.total;
    const monthlySavings = financialData.savings.total;
    const debtToIncomeRatio = totalIncome > 0 ? (totalDebt / totalIncome) * 100 : 0;
    const disposableIncome = totalIncome - monthlyExpenses;

    const strategies: string[] = [];
    const actionItems: string[] = [];

    // High debt-to-income ratio strategy
    if (debtToIncomeRatio > 40) {
      strategies.push("Your debt-to-income ratio is high. Focus on aggressive debt reduction.");
      actionItems.push(
        "Consider debt consolidation to lower interest rates",
        "Create a strict budget to free up more money for debt payments",
        "Look for ways to increase your income through side gigs or part-time work"
      );
    } else if (debtToIncomeRatio > 20) {
      strategies.push("Your debt-to-income ratio is moderate. Maintain consistent payments while building savings.");
      actionItems.push(
        "Continue making regular payments on all debts",
        "Build an emergency fund to prevent new debt",
        "Consider making extra payments on high-interest debt"
      );
    } else {
      strategies.push("Your debt-to-income ratio is healthy. Focus on maintaining good financial habits.");
      actionItems.push(
        "Continue making regular payments",
        "Consider investing excess funds",
        "Build a larger emergency fund"
      );
    }

    // High-interest debt strategy
    const highInterestDebt = financialData.debt.creditCard + financialData.debt.personal;
    if (highInterestDebt > totalDebt * 0.3) {
      strategies.push("You have significant high-interest debt. Prioritize paying this off first.");
      actionItems.push(
        "Use the avalanche method: pay minimums on all debts, put extra toward highest interest debt",
        "Consider balance transfer to lower interest rate cards",
        "Look for personal loan options with lower interest rates"
      );
    }

    // Student loan strategy
    if (financialData.debt.student > 0) {
      strategies.push("You have student loans. Consider income-driven repayment plans or refinancing.");
      actionItems.push(
        "Research student loan forgiveness programs",
        "Consider refinancing if you can get a lower interest rate",
        "Look into employer student loan repayment assistance programs"
      );
    }

    // Mortgage strategy
    if (financialData.debt.mortgage > 0) {
      if (debtToIncomeRatio < 30) {
        strategies.push("Your mortgage is manageable. Consider making extra payments to build equity faster.");
        actionItems.push(
          "Make bi-weekly payments instead of monthly",
          "Consider refinancing if rates have dropped",
          "Make one extra payment per year to reduce loan term"
        );
      } else {
        strategies.push("Your mortgage is a significant portion of your debt. Focus on maintaining regular payments.");
        actionItems.push(
          "Ensure you have adequate home insurance",
          "Consider refinancing if it makes financial sense",
          "Build an emergency fund for home repairs"
        );
      }
    }

    // Car loan strategy
    if (financialData.debt.car > 0) {
      strategies.push("You have a car loan. Consider ways to optimize this debt.");
      actionItems.push(
        "Consider refinancing if you can get a lower rate",
        "Make extra payments to reduce the loan term",
        "Keep up with regular maintenance to preserve car value"
      );
    }

    // General debt reduction strategies
    if (disposableIncome > 0) {
      strategies.push(`You have ₹${formatNumber(disposableIncome)} in disposable income each month. Use this wisely to reduce debt.`);
      actionItems.push(
        "Create a debt snowball plan: pay off smallest debts first for quick wins",
        "Set up automatic payments to avoid missed payments",
        "Consider using windfalls (bonuses, tax refunds) to pay down debt"
      );
    }

    return { strategies, actionItems };
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
        </div>

        {/* Content Sections */}
        <div className="content-section">
          {activeTab === "overview" && (
            <div className="overview-grid">
              <div className="metric-card">
                <h3>Monthly Income</h3>
                <p className="metric-value">{formatCurrency(financialData.income.total)}</p>
                <div className="metric-trend">
                  <ArrowUpRight size={16} color="#10B981" />
                  <span className="trend-positive">+5% from last month</span>
                </div>
              </div>
              <div className="metric-card">
                <h3>Monthly Expenses</h3>
                <p className="metric-value">{formatCurrency(financialData.expenses.total)}</p>
                <div className="metric-trend">
                  <ArrowDownRight size={16} color="#EF4444" />
                  <span className="trend-negative">+2% from last month</span>
                </div>
              </div>
              <div className="metric-card">
                <h3>Savings Rate</h3>
                <p className="metric-value">{formatPercentage(savingsRate)}</p>
                <div className="metric-trend">
                  <ArrowUpRight size={16} color="#10B981" />
                  <span className="trend-positive">+1.2% from last month</span>
                </div>
              </div>
              <div className="metric-card">
                <h3>Debt to Income</h3>
                <p className="metric-value">{formatPercentage(debtToIncomeRatio)}</p>
                <div className="metric-trend">
                  <ArrowDownRight size={16} color="#EF4444" />
                  <span className="trend-negative">-0.5% from last month</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "budget" && (
            <div className="budget-section">
              <div className="expense-chart">
                <h3>Expense Breakdown</h3>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={getExpenseData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {getExpenseData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={formatChartValue} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="budget-form">
                <h3>Update Budget</h3>
                <p className="form-instructions">Enter your monthly income and expenses in Indian Rupees (₹). All amounts should be in whole numbers.</p>
                <div className="form-group">
                  <label>Monthly Income</label>
                  <div className="input-with-unit">
                    <input
                      type="number"
                      value={getInputValue('income', 'salary', financialData.income.salary)}
                      onChange={(e) => handleInputChange("income", Number(e.target.value), "salary")}
                      onFocus={() => handleInputFocus('income', 'salary')}
                      onBlur={() => handleInputBlur('income', 'salary')}
                      placeholder="Enter monthly income"
                    />
                    <span className="unit">₹/month</span>
                  </div>
                </div>
                {Object.entries(financialData.expenses)
                  .filter(([key]) => key !== 'total')
                  .map(([category, value]) => (
                    <div key={category} className="form-group">
                      <label>{category.charAt(0).toUpperCase() + category.slice(1)}</label>
                      <div className="input-with-unit">
                        <input
                          type="number"
                          value={getInputValue('expenses', category, value as number)}
                          onChange={(e) => handleInputChange("expenses", Number(e.target.value), category as any)}
                          onFocus={() => handleInputFocus('expenses', category)}
                          onBlur={() => handleInputBlur('expenses', category)}
                          placeholder={`Enter ${category} expenses`}
                        />
                        <span className="unit">₹/month</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {activeTab === "investments" && (
            <div className="investments-section">
              <div className="investment-chart">
                <h3>Investment Allocation</h3>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={getInvestmentData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {getInvestmentData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={formatChartValue} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="investment-form">
                <h3>Update Investments</h3>
                <p className="form-instructions">Enter your current investment amounts in Indian Rupees (₹). Include all your investments across different categories.</p>
                {Object.entries(financialData.investments)
                  .filter(([key]) => key !== 'total')
                  .map(([category, value]) => (
                    <div key={category} className="form-group">
                      <label>{category.charAt(0).toUpperCase() + category.slice(1)}</label>
                      <div className="input-with-unit">
                        <input
                          type="number"
                          value={getInputValue('investments', category, value as number)}
                          onChange={(e) => handleInputChange("investments", Number(e.target.value), category as any)}
                          onFocus={() => handleInputFocus('investments', category)}
                          onBlur={() => handleInputBlur('investments', category)}
                          placeholder={`Enter ${category} investment`}
                        />
                        <span className="unit">₹</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {activeTab === "debt" && (
            <div className="debt-section">
              <div className="debt-chart">
                <h3>Debt Overview</h3>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsBarChart data={getDebtData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={formatChartValue} />
                      <Bar dataKey="value" fill="#8884d8">
                        {getDebtData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="debt-form">
                <h3>Debt Management</h3>
                <p className="form-instructions">Enter your current outstanding debt amounts in Indian Rupees (₹). Include all your loans and credit card balances.</p>
                {Object.entries(financialData.debt)
                  .filter(([key]) => key !== 'total')
                  .map(([category, value]) => (
                    <div key={category} className="form-group">
                      <label>{category.charAt(0).toUpperCase() + category.slice(1)}</label>
                      <div className="input-with-unit">
                        <input
                          type="number"
                          value={getInputValue('debt', category, value as number)}
                          onChange={(e) => handleInputChange("debt", Number(e.target.value), category as any)}
                          onFocus={() => handleInputFocus('debt', category)}
                          onBlur={() => handleInputBlur('debt', category)}
                          placeholder={`Enter ${category} debt`}
                        />
                        <span className="unit">₹</span>
                      </div>
                    </div>
                  ))}
                
                <div className="debt-strategy">
                  <h4>Personalized Debt Strategy</h4>
                  {(() => {
                    const { strategies, actionItems } = calculateDebtStrategy();
                    return (
                      <>
                        <div className="strategy-summary">
                          <h5>Key Strategies</h5>
                          <ul>
                            {strategies.map((strategy, index) => (
                              <li key={index}>
                                <Lightbulb size={16} />
                                <span>{strategy}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="action-items">
                          <h5>Recommended Actions</h5>
                          <ul>
                            {actionItems.map((item, index) => (
                              <li key={index}>
                                <CheckCircle size={16} />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {activeTab === "goals" && (
            <div className="goals-section">
              <div className="goals-chart">
                <h3>Goals Progress</h3>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsBarChart data={[
                      {
                        name: "Short Term",
                        target: financialData.goals.shortTerm.amount,
                        current: financialData.savings.total * 0.3,
                      },
                      {
                        name: "Medium Term",
                        target: financialData.goals.mediumTerm.amount,
                        current: financialData.savings.total * 0.4,
                      },
                      {
                        name: "Long Term",
                        target: financialData.goals.longTerm.amount,
                        current: financialData.savings.total * 0.3,
                      },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={formatChartValue} />
                      <Legend />
                      <Bar dataKey="target" fill="#8884d8" name="Target" />
                      <Bar dataKey="current" fill="#82ca9d" name="Current" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="goals-form">
                <h3>Set Financial Goals</h3>
                <p className="form-instructions">Set your financial goals by entering the target amount, timeline, and a brief description. Amounts should be in Indian Rupees (₹).</p>
                {Object.entries(financialData.goals).map(([term, goal]) => (
                  <div key={term} className="goal-group">
                    <h4>{term.charAt(0).toUpperCase() + term.slice(1)} Term Goal</h4>
                    <div className="form-group">
                      <label>Target Amount</label>
                      <div className="input-with-unit">
                        <input
                          type="number"
                          value={getInputValue('goals', `${term}-amount`, goal.amount)}
                          onChange={(e) => handleInputChange("goals", Number(e.target.value), `${term}.amount` as any)}
                          onFocus={() => handleInputFocus('goals', `${term}-amount`)}
                          onBlur={() => handleInputBlur('goals', `${term}-amount`)}
                          placeholder="Enter target amount"
                        />
                        <span className="unit">₹</span>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Timeline</label>
                      <div className="input-with-unit">
                        <input
                          type="number"
                          value={getInputValue('goals', `${term}-timeline`, goal.timeline)}
                          onChange={(e) => handleInputChange("goals", Number(e.target.value), `${term}.timeline` as any)}
                          onFocus={() => handleInputFocus('goals', `${term}-timeline`)}
                          onBlur={() => handleInputBlur('goals', `${term}-timeline`)}
                          placeholder="Enter timeline"
                        />
                        <span className="unit">years</span>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <input
                        type="text"
                        value={goal.description}
                        onChange={(e) => handleGoalDescriptionChange(term as keyof FinancialData["goals"], e.target.value)}
                        placeholder="Enter goal description (e.g., Down payment for house, Child's education)"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "projections" && (
            <div className="projections-section">
              <div className="savings-projection">
                <h3>Savings Projection</h3>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsLineChart data={getSavingsProjection()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={formatChartValue} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="savings"
                        stroke="#8884d8"
                        name="Current Savings"
                      />
                      <Line
                        type="monotone"
                        dataKey="projection"
                        stroke="#82ca9d"
                        name="Projected Growth"
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="retirement-projection">
                <h3>Retirement Projection</h3>
                <div className="projection-details">
                  <div className="detail-item">
                    <span className="label">Current Age: </span>
                    <span className="value">{30}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Retirement Age: </span>
                    <span className="value">{retirementAge}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Years to Retirement: </span>
                    <span className="value">{retirementAge - 30}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Current Retirement Savings: </span>
                    <span className="value">{formatCurrency(financialData.savings.retirement)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Monthly Contribution Needed: </span>
                    <span className="value">{formatCurrency(Math.round(monthlyBudget * 0.15))}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Projected Retirement Corpus: </span>
                    <span className="value">{formatCurrency(retirementSavings)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "personal" && (
            <div className="personal-section">
              <div className="personal-form">
                <h3>Personal Information</h3>
                <p className="form-instructions">Please provide your personal details to help us create a more accurate financial plan.</p>
                
                <div className="form-group">
                  <label>Age</label>
                  <div className="input-with-unit">
                    <input
                      type="number"
                      value={getInputValue('personal', 'age', personalInfo.age)}
                      onChange={(e) => setPersonalInfo(prev => ({ ...prev, age: Number(e.target.value) }))}
                      onFocus={() => handleInputFocus('personal', 'age')}
                      onBlur={() => handleInputBlur('personal', 'age')}
                      placeholder="Enter your age"
                    />
                    <span className="unit">years</span>
                  </div>
                </div>

                <div className="form-group">
                  <label>Employment Status</label>
                  <select
                    value={personalInfo.employmentStatus}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, employmentStatus: e.target.value as PersonalInfo["employmentStatus"] }))}
                  >
                    <option value="employed">Employed</option>
                    <option value="self-employed">Self-employed</option>
                    <option value="retired">Retired</option>
                    <option value="student">Student</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Marital Status</label>
                  <select
                    value={personalInfo.maritalStatus}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, maritalStatus: e.target.value as PersonalInfo["maritalStatus"] }))}
                  >
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Number of Dependents</label>
                  <div className="input-with-unit">
                    <input
                      type="number"
                      value={getInputValue('personal', 'dependents', personalInfo.dependents)}
                      onChange={(e) => setPersonalInfo(prev => ({ ...prev, dependents: Number(e.target.value) }))}
                      onFocus={() => handleInputFocus('personal', 'dependents')}
                      onBlur={() => handleInputBlur('personal', 'dependents')}
                      placeholder="Enter number of dependents"
                    />
                    <span className="unit">persons</span>
                  </div>
                </div>

                <div className="form-group">
                  <label>City of Residence</label>
                  <input
                    type="text"
                    value={personalInfo.city}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="Enter your city"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <GoogleAd slot={"4077644091"} className="ad-bottom" />
      <Footer />
      <style jsx>{`
        .form-instructions {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
          line-height: 1.4;
        }
        .input-with-unit {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-with-unit input {
          padding-right: 2.5rem;
        }
        .unit {
          position: absolute;
          right: 0.75rem;
          color: #666;
          font-size: 0.9rem;
          pointer-events: none;
        }
        .goal-group {
          margin-bottom: 2rem;
          padding: 1rem;
          border: 1px solid #eee;
          border-radius: 0.5rem;
        }
        .goal-group h4 {
          margin-bottom: 1rem;
          color: #333;
        }
        .personal-section {
          padding: 2rem;
          background: white;
          border-radius: 0.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .personal-form {
          max-width: 600px;
          margin: 0 auto;
        }
        .form-group select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 0.25rem;
          font-size: 1rem;
          background-color: white;
        }
        .form-group select:focus {
          outline: none;
          border-color: #0070f3;
        }
        .debt-strategy {
          margin-top: 2rem;
          padding: 1.5rem;
          background: #f8f9fa;
          border-radius: 0.5rem;
          border: 1px solid #e9ecef;
        }
        .debt-strategy h4 {
          color: #333;
          margin-bottom: 1rem;
        }
        .debt-strategy h5 {
          color: #495057;
          margin: 1rem 0;
          font-size: 1.1rem;
        }
        .debt-strategy ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .debt-strategy li {
          display: flex;
          align-items: flex-start;
          margin-bottom: 0.75rem;
          color: #495057;
        }
        .debt-strategy li svg {
          margin-right: 0.5rem;
          flex-shrink: 0;
          color: #0070f3;
        }
        .strategy-summary {
          margin-bottom: 1.5rem;
        }
        .action-items {
          border-top: 1px solid #e9ecef;
          padding-top: 1.5rem;
        }
      `}</style>
    </div>
  );
};

export default FinancialPlanning; 