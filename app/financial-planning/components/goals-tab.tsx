// components/FinancialPlanning/GoalsTab.tsx
"use client";
import React from "react";
import {
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";

interface GoalsTabProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    financialData: any;
    formatChartValue: (val: number) => string;
    getInputValue: (cat: string, sub: string, val: number) => string | number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleInputChange: (cat: any, val: number, subCat: any) => void;
    handleInputFocus: (cat: string, subCat: string) => void;
    handleInputBlur: (cat: string, subCat: string) => void;
    handleGoalDescriptionChange: (term: "shortTerm" | "mediumTerm" | "longTerm", description: string) => void;
}

const GoalsTab: React.FC<GoalsTabProps> = ({
    financialData,
    formatChartValue,
    getInputValue,
    handleInputChange,
    handleInputFocus,
    handleInputBlur,
    handleGoalDescriptionChange
}) => {
    return (
        <div className="goals-section">
            <div className="goals-chart">
                <h3>Goals Progress</h3>
                <div className="chart-container">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={[
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
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="goals-form">
                <h3>Set Financial Goals</h3>
                <p className="form-instructions">Set your financial goals by entering the target amount, timeline, and a brief description. Amounts should be in Indian Rupees (₹).</p>
                {Object.entries(financialData.goals).map(([term, goal]) => {
                    const typedGoal = goal as { amount: number; timeline: number; description: string };
                    return (
                        <div key={term} className="goal-group">
                            <h4>{term.charAt(0).toUpperCase() + term.slice(1)} Term Goal</h4>
                            <div className="form-group">
                                <label>Target Amount</label>
                                <div className="input-with-unit">
                                    <input
                                        type="number"
                                        value={getInputValue('goals', `${term}-amount`, typedGoal.amount)}
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                                        value={getInputValue('goals', `${term}-timeline`, typedGoal.timeline)}
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                                    value={typedGoal.description}
                                    onChange={(e) => handleGoalDescriptionChange(term as "shortTerm" | "mediumTerm" | "longTerm", e.target.value)}
                                    placeholder="Enter goal description (e.g., Down payment for house, Child's education)"
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default GoalsTab;

// --- Usage Example ---
// import GoalsTab from "./components/FinancialPlanning/GoalsTab";
// ...
// {activeTab === "goals" && (
//   <GoalsTab
//     financialData={financialData}
//     formatChartValue={formatChartValue}
//     getInputValue={getInputValue}
//     handleInputChange={handleInputChange}
//     handleInputFocus={handleInputFocus}
//     handleInputBlur={handleInputBlur}
//     handleGoalDescriptionChange={handleGoalDescriptionChange}
//   />
// )}
