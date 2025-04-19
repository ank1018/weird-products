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

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#FF6699",
  "#CC33FF",
];

interface BudgetTabProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  financialData: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getExpenseData: () => any[];
  formatCurrency: (val: number) => string;
  formatChartValue: (val: number) => string;
  getInputValue: (cat: string, sub: string, val: number) => string | number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleInputChange: (cat: any, val: number, subCat: any) => void;
  handleInputFocus: (cat: string, subCat: string) => void;
  handleInputBlur: (cat: string, subCat: string) => void;
}

const BudgetTab: React.FC<BudgetTabProps> = ({
  financialData,
  getExpenseData,
  formatChartValue,
  getInputValue,
  handleInputChange,
  handleInputFocus,
  handleInputBlur,
}) => {
  // Custom legend to display the category name and its percentage share.
  const renderCustomizedLegend = (props: any) => {
    const { payload } = props;
    const expenseData = getExpenseData();
    const totalValue = expenseData.reduce((acc, item) => acc + item.value, 0);
    return (
      <ul className="customized-legend">
        {payload.map((entry: any, index: number) => {
          const item = expenseData[index];
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
    <div className="budget-section">
      <div className="expense-chart">
        <h3>Expense Breakdown</h3>
        <div className="bt-chart-container">
          <ResponsiveContainer width="100%" height={500}>
            <PieChart>
              <Pie
                data={getExpenseData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              // label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {getExpenseData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={formatChartValue} />
              <Legend content={renderCustomizedLegend} />
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
                  onChange={(e) => handleInputChange("expenses", Number(e.target.value), category)}
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
  );
};

export default BudgetTab;