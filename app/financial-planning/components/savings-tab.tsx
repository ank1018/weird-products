import React from 'react';
import { FinancialData } from '../types/financial-data';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";
import '../styles/financial-planning.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface SavingsTabProps {
    financialData: FinancialData;
    onUpdate: (updates: Partial<FinancialData>) => void;
}

const SavingsTab: React.FC<SavingsTabProps> = ({ financialData, onUpdate }) => {
    const handleSavingsChange = (field: keyof typeof financialData.savings, value: number) => {
        const newSavings = {
            ...financialData.savings,
            [field]: value,
        };

        // Calculate total by summing all non-total fields
        const total = Object.entries(newSavings)
            .filter(([key]) => key !== 'total')
            .reduce((sum, [, value]) => sum + (typeof value === 'number' ? value : 0), 0);

        onUpdate({
            savings: {
                ...newSavings,
                total
            }
        });
    };

    const getSavingsData = () => {
        const savingsCategories = {
            emergency: financialData.savings.emergency,
            retirement: financialData.savings.retirement,
            other: financialData.savings.other
        };

        return Object.entries(savingsCategories)
            .map(([name, value]) => ({
                name: name.charAt(0).toUpperCase() + name.slice(1),
                value,
            }));
    };

    return (
        <div className="savings-section">
            <div className="savings-chart">
                <h3>Monthly Savings Distribution</h3>
                <div className="chart-container">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={getSavingsData()}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                            >
                                {getSavingsData().map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="savings-form">
                <h3>Update Monthly Savings</h3>
                <div className="form-grid">
                    {Object.entries(financialData.savings)
                        .filter(([key]) => key !== 'total' && key !== 'investment')
                        .map(([category, value]) => (
                            <div key={category} className="form-group">
                                <label>{category.charAt(0).toUpperCase() + category.slice(1)}</label>
                                <div className="input-with-unit">
                                    <input
                                        type="number"
                                        value={value === 0 ? '' : value}
                                        onChange={(e) => handleSavingsChange(category as keyof typeof financialData.savings, e.target.value === '' ? 0 : Number(e.target.value))}
                                        placeholder={`Enter ${category} amount`}
                                    />
                                    <span className="unit">₹/month</span>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default SavingsTab; 