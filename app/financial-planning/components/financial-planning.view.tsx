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
} from "lucide-react";
import "./financial-planning.css";
import NavBarView from "../../nav-bar/nav-bar.view";
import GoogleAd from "../../google-ads/google-ads.view";
import Footer from "../../footer/footer.view";

interface FinancialData {
  income: number;
  expenses: {
    housing: number;
    transportation: number;
    food: number;
    utilities: number;
    entertainment: number;
    other: number;
  };
  savings: number;
  investments: number;
  debt: number;
  goals: {
    shortTerm: number;
    mediumTerm: number;
    longTerm: number;
  };
}

const FinancialPlanning = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [financialData, setFinancialData] = useState<FinancialData>({
    income: 0,
    expenses: {
      housing: 0,
      transportation: 0,
      food: 0,
      utilities: 0,
      entertainment: 0,
      other: 0,
    },
    savings: 0,
    investments: 0,
    debt: 0,
    goals: {
      shortTerm: 0,
      mediumTerm: 0,
      longTerm: 0,
    },
  });

  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [savingsRate, setSavingsRate] = useState(0);
  const [debtToIncomeRatio, setDebtToIncomeRatio] = useState(0);
  const [retirementAge, setRetirementAge] = useState(65);
  const [retirementSavings, setRetirementSavings] = useState(0);

  useEffect(() => {
    // Calculate key metrics whenever financial data changes
    const totalExpenses = Object.values(financialData.expenses).reduce(
      (sum, expense) => sum + expense,
      0
    );
    const netIncome = financialData.income - totalExpenses;
    setMonthlyBudget(netIncome);
    setSavingsRate((financialData.savings / financialData.income) * 100);
    setDebtToIncomeRatio((financialData.debt / financialData.income) * 100);
  }, [financialData]);

  const handleInputChange = (
    category: keyof FinancialData,
    value: number,
    subCategory?: keyof FinancialData["expenses"] | keyof FinancialData["goals"]
  ) => {
    setFinancialData((prev) => {
      if (subCategory) {
        return {
          ...prev,
          [category]: {
            ...(prev[category] as Record<string, any>),
            [subCategory]: value,
          },
        };
      }
      return {
        ...prev,
        [category]: value,
      };
    });
  };

  const calculateRetirementSavings = () => {
    const yearsToRetirement = retirementAge - new Date().getFullYear();
    const annualSavings = financialData.savings * 12;
    const investmentReturn = 0.07; // 7% average annual return
    let total = 0;

    for (let i = 0; i < yearsToRetirement; i++) {
      total = (total + annualSavings) * (1 + investmentReturn);
    }

    setRetirementSavings(total);
  };

  const getFinancialHealthScore = () => {
    const score = Math.min(
      100,
      Math.max(
        0,
        (savingsRate * 0.4) +
          ((100 - debtToIncomeRatio) * 0.3) +
          ((financialData.investments / financialData.income) * 30)
      )
    );
    return Math.round(score);
  };

  const getFinancialAdvice = () => {
    const score = getFinancialHealthScore();
    if (score >= 80) {
      return "Excellent financial health! Keep up the good work and consider increasing your investment contributions.";
    } else if (score >= 60) {
      return "Good financial health. Focus on increasing your savings rate and reducing debt.";
    } else if (score >= 40) {
      return "Fair financial health. Consider creating a detailed budget and setting specific financial goals.";
    } else {
      return "Needs improvement. Focus on reducing expenses, increasing income, and creating an emergency fund.";
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
            <span className="score-value">{getFinancialHealthScore()}</span>
            <span className="score-label">Financial Health Score</span>
          </div>
          <p className="financial-advice">{getFinancialAdvice()}</p>
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
        </div>

        {/* Content Sections */}
        <div className="content-section">
          {activeTab === "overview" && (
            <div className="overview-grid">
              <div className="metric-card">
                <h3>Monthly Income</h3>
                <p className="metric-value">${financialData.income.toLocaleString()}</p>
                <div className="metric-trend">
                  <ArrowUpRight size={16} color="#10B981" />
                  <span className="trend-positive">+5% from last month</span>
                </div>
              </div>
              <div className="metric-card">
                <h3>Monthly Expenses</h3>
                <p className="metric-value">
                  ${Object.values(financialData.expenses).reduce((sum, expense) => sum + expense, 0).toLocaleString()}
                </p>
                <div className="metric-trend">
                  <ArrowDownRight size={16} color="#EF4444" />
                  <span className="trend-negative">+2% from last month</span>
                </div>
              </div>
              <div className="metric-card">
                <h3>Savings Rate</h3>
                <p className="metric-value">{savingsRate.toFixed(1)}%</p>
                <div className="metric-trend">
                  <ArrowUpRight size={16} color="#10B981" />
                  <span className="trend-positive">+1.2% from last month</span>
                </div>
              </div>
              <div className="metric-card">
                <h3>Debt to Income</h3>
                <p className="metric-value">{debtToIncomeRatio.toFixed(1)}%</p>
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
                  {/* Placeholder for pie chart */}
                  <PieChart size={200} />
                </div>
              </div>
              <div className="budget-form">
                <h3>Update Budget</h3>
                <div className="form-group">
                  <label>Monthly Income</label>
                  <input
                    type="number"
                    value={financialData.income}
                    onChange={(e) => handleInputChange("income", Number(e.target.value))}
                  />
                </div>
                {Object.entries(financialData.expenses).map(([category, value]) => (
                  <div key={category} className="form-group">
                    <label>{category.charAt(0).toUpperCase() + category.slice(1)}</label>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => handleInputChange("expenses", Number(e.target.value), category as keyof FinancialData["expenses"])}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "investments" && (
            <div className="investments-section">
              <div className="investment-chart">
                <h3>Investment Growth</h3>
                <div className="chart-container">
                  {/* Placeholder for line chart */}
                  <LineChart size={200} />
                </div>
              </div>
              <div className="retirement-calculator">
                <h3>Retirement Calculator</h3>
                <div className="form-group">
                  <label>Target Retirement Age</label>
                  <input
                    type="number"
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(Number(e.target.value))}
                  />
                </div>
                <button onClick={calculateRetirementSavings} className="calculate-button">
                  Calculate Retirement Savings
                </button>
                {retirementSavings > 0 && (
                  <div className="retirement-result">
                    <h4>Projected Retirement Savings</h4>
                    <p>${retirementSavings.toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "debt" && (
            <div className="debt-section">
              <div className="debt-chart">
                <h3>Debt Overview</h3>
                <div className="chart-container">
                  {/* Placeholder for bar chart */}
                  <BarChart size={200} />
                </div>
              </div>
              <div className="debt-form">
                <h3>Debt Management</h3>
                <div className="form-group">
                  <label>Total Debt</label>
                  <input
                    type="number"
                    value={financialData.debt}
                    onChange={(e) => handleInputChange("debt", Number(e.target.value))}
                  />
                </div>
                <div className="debt-strategy">
                  <h4>Recommended Debt Strategy</h4>
                  <p>Based on your current financial situation, we recommend:</p>
                  <ul>
                    <li>Focus on high-interest debt first</li>
                    <li>Consider debt consolidation if applicable</li>
                    <li>Maintain minimum payments on all debts</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === "goals" && (
            <div className="goals-section">
              <div className="goals-chart">
                <h3>Goals Progress</h3>
                <div className="chart-container">
                  {/* Placeholder for progress chart */}
                  <Target size={200} />
                </div>
              </div>
              <div className="goals-form">
                <h3>Set Financial Goals</h3>
                <div className="form-group">
                  <label>Short-term Goals ($)</label>
                  <input
                    type="number"
                    value={financialData.goals.shortTerm}
                    onChange={(e) => handleInputChange("goals", Number(e.target.value), "shortTerm")}
                  />
                </div>
                <div className="form-group">
                  <label>Medium-term Goals ($)</label>
                  <input
                    type="number"
                    value={financialData.goals.mediumTerm}
                    onChange={(e) => handleInputChange("goals", Number(e.target.value), "mediumTerm")}
                  />
                </div>
                <div className="form-group">
                  <label>Long-term Goals ($)</label>
                  <input
                    type="number"
                    value={financialData.goals.longTerm}
                    onChange={(e) => handleInputChange("goals", Number(e.target.value), "longTerm")}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <GoogleAd slot={"4077644091"} className="ad-bottom" />
      <Footer />
    </div>
  );
};

export default FinancialPlanning; 