"use client";
import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

interface Recommendations {
    emergencyFund: number;
    retirementCorpus: number;
    monthlySavings: number;
    lifeInsurance: number;
    healthInsurance: number;
    investmentAllocation: {
        equity: number;
        debt: number;
        gold: number;
    };
    advice: string[];
    aiInsights: string[];
    monthlyIncome: number;
    monthlyExpenses: number;
}

interface FinancialRecommendationsProps {
    recommendations: Recommendations;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

export default function FinancialRecommendations({ recommendations }: FinancialRecommendationsProps) {
    const investmentData = [
        { name: 'Equity', value: recommendations.investmentAllocation.equity },
        { name: 'Debt', value: recommendations.investmentAllocation.debt },
        { name: 'Gold', value: recommendations.investmentAllocation.gold }
    ];

    const monthlyData = [
        { name: 'Income', value: recommendations.monthlyIncome },
        { name: 'Expenses', value: recommendations.monthlyExpenses },
        { name: 'Savings', value: recommendations.monthlyIncome - recommendations.monthlyExpenses }
    ];

    return (
        <div className="recommendations-container">
            <h2>Your Financial Recommendations</h2>
            
            <div className="charts-grid">
                <div className="chart-container">
                    <h3>Monthly Cash Flow</h3>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                                <Bar dataKey="value" fill="#4299e1">
                                    {monthlyData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-container">
                    <h3>Investment Allocation</h3>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={investmentData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {investmentData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `${value}%`} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="recommendation-section">
                <h3>Emergency Fund</h3>
                <p>You should maintain an emergency fund of ₹{recommendations.emergencyFund.toLocaleString()}</p>
                <p className="explanation">This is 6 months of your living expenses to handle unexpected situations.</p>
            </div>

            <div className="recommendation-section">
                <h3>Retirement Planning</h3>
                <p>Target Retirement Corpus: ₹{recommendations.retirementCorpus.toLocaleString()}</p>
                <p>Monthly Savings Required: ₹{recommendations.monthlySavings.toLocaleString()}</p>
                <p className="explanation">Based on a 4% withdrawal rate and considering inflation.</p>
            </div>

            <div className="recommendation-section">
                <h3>Insurance Coverage</h3>
                <p>Recommended Life Insurance Coverage: ₹{recommendations.lifeInsurance.toLocaleString()}</p>
                <p>Recommended Health Insurance Coverage: ₹{recommendations.healthInsurance.toLocaleString()}</p>
                <p className="explanation">Based on your income, dependents, and current expenses.</p>
            </div>

            <div className="recommendation-section">
                <h3>Actionable Advice</h3>
                <ul className="advice-list">
                    {recommendations.advice.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </div>

            {recommendations.aiInsights && recommendations.aiInsights.length > 0 && (
                <div className="recommendation-section ai-insights">
                    <h3>AI-Powered Insights</h3>
                    <ul className="advice-list">
                        {recommendations.aiInsights.map((insight, index) => (
                            <li key={index}>{insight}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
} 