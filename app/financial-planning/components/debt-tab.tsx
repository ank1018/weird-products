// components/FinancialPlanning/DebtTab.tsx
"use client";
import React from "react";
import {
    BarChart,
    Bar,
    Cell,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import { Lightbulb, CheckCircle } from "lucide-react";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

interface DebtTabProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    financialData: any;
    formatChartValue: (val: number) => string;
    getInputValue: (cat: string, sub: string, val: number) => string | number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleInputChange: (cat: any, val: number, subCat: any) => void;
    handleInputFocus: (cat: string, subCat: string) => void;
    handleInputBlur: (cat: string, subCat: string) => void;
}

const DebtTab: React.FC<DebtTabProps> = ({
    financialData,
    formatChartValue,
    getInputValue,
    handleInputChange,
    handleInputFocus,
    handleInputBlur,
}) => {

    // Add debt strategy calculation function
    const calculateDebtStrategy = () => {
        const totalDebt = financialData.debt.total;
        const totalIncome = financialData.income.total;
        const monthlyExpenses = financialData.expenses.total;
        const debtToIncomeRatio = totalIncome > 0 ? (totalDebt / totalIncome) * 100 : 0;
        const disposableIncome = totalIncome - monthlyExpenses;

        const strategies: string[] = [];
        const actionItems: string[] = [];

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

        // Format percentage function
        const formatPercentage = (value: number | undefined | null): string => {
            if (value === undefined || value === null || isNaN(value)) {
                return "0%";
            }
            return `${value.toFixed(1)}%`;
        };

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
        const highInterestDebt = financialData.debt.creditCard.amount + financialData.debt.personal.amount;
        if (highInterestDebt > totalDebt * 0.3) {
            strategies.push("You have significant high-interest debt. Prioritize paying this off first.");
            actionItems.push(
                "Use the avalanche method: pay minimums on all debts, put extra toward highest interest debt",
                "Consider balance transfer to lower interest rate cards",
                "Look for personal loan options with lower interest rates"
            );
        }

        // Student loan strategy
        if (financialData.debt.student.amount > 0) {
            strategies.push(`You have student loans with ${formatPercentage(financialData.debt.student.interestRate)} interest. Consider income-driven repayment plans or refinancing.`);
            actionItems.push(
                "Research student loan forgiveness programs",
                "Consider refinancing if you can get a lower interest rate",
                "Look into employer student loan repayment assistance programs"
            );
        }

        // Mortgage strategy
        if (financialData.debt.mortgage.amount > 0) {
            if (debtToIncomeRatio < 30) {
                strategies.push(`Your mortgage at ${formatPercentage(financialData.debt.mortgage.interestRate)} interest is manageable. Consider making extra payments to build equity faster.`);
                actionItems.push(
                    "Make bi-weekly payments instead of monthly",
                    "Consider refinancing if rates have dropped",
                    "Make one extra payment per year to reduce loan term"
                );
            } else {
                strategies.push(`Your mortgage at ${formatPercentage(financialData.debt.mortgage.interestRate)} interest is a significant portion of your debt. Focus on maintaining regular payments.`);
                actionItems.push(
                    "Ensure you have adequate home insurance",
                    "Consider refinancing if it makes financial sense",
                    "Build an emergency fund for home repairs"
                );
            }
        }

        // Car loan strategy
        if (financialData.debt.car.amount > 0) {
            strategies.push(`You have a car loan at ${formatPercentage(financialData.debt.car.interestRate)} interest. Consider ways to optimize this debt.`);
            actionItems.push(
                "Consider refinancing if you can get a lower rate",
                "Make extra payments to reduce the loan term",
                "Keep up with regular maintenance to preserve car value"
            );
        }

        // Credit card strategy
        if (financialData.debt.creditCard.amount > 0) {
            strategies.push(`Your credit card debt at ${formatPercentage(financialData.debt.creditCard.interestRate)} interest is high-interest debt. Focus on paying this off quickly.`);
            actionItems.push(
                "Pay more than the minimum payment each month",
                "Consider a balance transfer to a card with 0% introductory APR",
                "Stop using credit cards until debt is paid off"
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

    const { strategies, actionItems } = calculateDebtStrategy();

    const getDebtData = () => {
        return Object.entries(financialData.debt)
            .filter(([key]) => key !== 'total')
            .map(([name, value]) => {
                const typedValue = value as { amount: number; interestRate: number };
                return {
                    name: name.charAt(0).toUpperCase() + name.slice(1),
                    value: typedValue.amount,
                    interestRate: typedValue.interestRate
                };
            });
    };
    console.log('financialData.debt...............', financialData.debt, getDebtData())
    return (
        <div className="debt-section">
            <div className="debt-chart">
                <h3>Debt Overview</h3>
                <div className="chart-container">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={getDebtData()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={formatChartValue} />
                            <Bar dataKey="value" fill="#8884d8">
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                {getDebtData().map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="debt-form">
                <h3>Debt Management</h3>
                <p className="form-instructions">Enter your current outstanding debt amounts and interest rates in Indian Rupees (₹). Include all your loans and credit card balances.</p>
                {Object.entries(financialData.debt)
                    .filter(([key]) => key !== 'total')
                    .map(([category, value]) => {
                        const typedValue = value as { amount: number; interestRate: number };
                        return (
                            <div key={category} className="form-group">
                                <label>{category.charAt(0).toUpperCase() + category.slice(1)}</label>
                                <div className="input-with-unit">
                                    <input
                                        type="number"
                                        value={getInputValue('debt', `${category}-amount`, typedValue.amount)}
                                        onChange={(e) => handleInputChange("debt", Number(e.target.value), `${category}.amount`)}
                                        onFocus={() => handleInputFocus('debt', `${category}-amount`)}
                                        onBlur={() => handleInputBlur('debt', `${category}-amount`)}
                                        placeholder={`Enter ${category} debt`}
                                    />
                                    <span className="unit">₹</span>
                                </div>
                                <div className="input-with-unit">
                                    <input
                                        type="number"
                                        value={getInputValue('debt', `${category}-interestRate`, typedValue.interestRate)}
                                        onChange={(e) => handleInputChange("debt", Number(e.target.value), `${category}.interestRate`)}
                                        onFocus={() => handleInputFocus('debt', `${category}-interestRate`)}
                                        onBlur={() => handleInputBlur('debt', `${category}-interestRate`)}
                                        placeholder={`Enter interest rate`}
                                    />
                                    <span className="unit">%</span>
                                </div>
                            </div>
                        );
                    })}

                <div className="debt-strategy">
                    <h4>Personalized Debt Strategy</h4>
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
                </div>
            </div>
        </div>
    );
};

export default DebtTab;

// --- Usage Example ---
// import DebtTab from "./components/FinancialPlanning/DebtTab";
// ...
// {activeTab === "debt" && (
//   <DebtTab
//     financialData={financialData}
//     getDebtData={getDebtData}
//     formatChartValue={formatChartValue}
//     getInputValue={getInputValue}
//     handleInputChange={handleInputChange}
//     handleInputFocus={handleInputFocus}
//     handleInputBlur={handleInputBlur}
//     calculateDebtStrategy={calculateDebtStrategy}
//   />
// )}
