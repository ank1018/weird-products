// components/FinancialPlanning/InvestmentsTab.tsx
"use client";
import React from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";
import '../styles/financial-planning.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

interface InvestmentsTabProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    financialData: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getInvestmentData: () => any[];
    formatCurrency: (val: number) => string;
    formatChartValue: (val: number) => string;
    getInputValue: (cat: string, sub: string, val: number) => string | number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleInputChange: (cat: any, val: number, subCat: any) => void;
    handleInputFocus: (cat: string, subCat: string) => void;
    handleInputBlur: (cat: string, subCat: string) => void;
}

const InvestmentsTab: React.FC<InvestmentsTabProps> = ({
    financialData,
    getInvestmentData,
    formatChartValue,
    getInputValue,
    handleInputChange,
    handleInputFocus,
    handleInputBlur,
}) => {
    const renderCustomizedLegend = (props: any) => {
        const { payload } = props;
        const investmentData = getInvestmentData();
        const totalValue = investmentData.reduce((acc, item) => acc + item.value, 0);
        return (
            <ul className="ia-customized-legend">
                {payload.map((entry: any, index: number) => {
                    const item = investmentData[index];
                    const percent =
                        totalValue > 0 ? ((item.value / totalValue) * 100).toFixed(0) : "0";
                    return (
                        <li
                            key={`item-${index}`}
                            style={{ color: entry.color, marginBottom: "4px" }}
                        >
                            {entry.value} ({percent}%)
                        </li>
                    );
                })}
            </ul>
        );
    };
    return (
        <div className="investments-section">
            <div className="investment-chart">
                <h3>Investment Allocation</h3>
                <div className="ia-chart-container">
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
                            // label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {getInvestmentData().map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={formatChartValue} />
                            <Legend content={renderCustomizedLegend} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="ia-investment-form">
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
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    );
};

export default InvestmentsTab;
