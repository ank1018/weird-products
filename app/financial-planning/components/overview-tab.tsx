// components/FinancialPlanning/OverviewTab.tsx
"use client";
import React from "react";
import {  ArrowUpRight, ArrowDownRight } from "lucide-react";

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
    return (
        <div className="overview-section">

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
        </div>
    );
};

export default OverviewTab;
