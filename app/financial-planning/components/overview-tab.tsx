// components/FinancialPlanning/OverviewTab.tsx
"use client";
import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface OverviewTabProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    financialData: any;
    formatCurrency: (value: number) => string;
    formatPercentage: (value: number) => string;
    savingsRate: number;
    debtToIncomeRatio: number;
    financialHealthScore: number;
    recommendations: string[];
    riskProfile: "Conservative" | "Moderate" | "Aggressive";
}

const OverviewTab: React.FC<OverviewTabProps> = ({
    financialData,
    formatCurrency,
    formatPercentage,
    savingsRate,
    debtToIncomeRatio,
}) => {
    const incomeMsg =
        financialData.income.total > 300000
            ? "Strong income base"
            : "Moderate income";

    const expenseMsg =
        financialData.expenses.total > financialData.income.total * 0.5
            ? "Expenses are high"
            : "Expenses in check";

    const savingsMsg =
        savingsRate >= 20 ? "Savings on track" : "Increase savings";

    const debtMsg =
        debtToIncomeRatio < 30 ? "Debt is managed" : "Debt is high";

    return (
        <div className="overview-section">
            <div className="overview-grid">
                <div className="metric-card">
                    <h3>Monthly Income</h3>
                    <p className="metric-value">
                        {formatCurrency(financialData.income.total)}
                    </p>
                    <div className="metric-trend">
                        <ArrowUpRight size={16} color="#10B981" />
                        <span>{incomeMsg}</span>
                    </div>
                </div>
                <div className="metric-card">
                    <h3>Monthly Expenses</h3>
                    <p className="metric-value">
                        {formatCurrency(financialData.expenses.total)}
                    </p>
                    <div className="metric-trend">
                        <ArrowDownRight size={16} color="#EF4444" />
                        <span>{expenseMsg}</span>
                    </div>
                </div>
                <div className="metric-card">
                    <h3>Savings Rate</h3>
                    <p className="metric-value">{formatPercentage(savingsRate)}</p>
                    <div className="metric-trend">
                        <ArrowUpRight size={16} color="#10B981" />
                        <span>{savingsMsg}</span>
                    </div>
                </div>
                <div className="metric-card">
                    <h3>Debt to Income</h3>
                    <p className="metric-value">{formatPercentage(debtToIncomeRatio)}</p>
                    <div className="metric-trend">
                        <ArrowDownRight size={16} color="#EF4444" />
                        <span>{debtMsg}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverviewTab;
