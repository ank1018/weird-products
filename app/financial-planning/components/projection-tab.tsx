// components/FinancialPlanning/ProjectionsTab.tsx
"use client";
import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

interface ProjectionsTabProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getSavingsProjection: () => any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  personalInfo: any;
  formatChartValue: (val: number) => string;
  formatCurrency: (val: number) => string;
  retirementAge: number;
  retirementSavings: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  financialData: any;
}

const ProjectionsTab: React.FC<ProjectionsTabProps> = ({
  personalInfo,
  getSavingsProjection,
  formatChartValue,
  formatCurrency,
  retirementAge,
  retirementSavings,
  financialData
}) => {
  return (
    <div className="projections-section">
      <div className="savings-projection">
        <h3>Savings Projection</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={getSavingsProjection()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={formatChartValue} />
              <Legend />
              <Line type="monotone" dataKey="savings" stroke="#8884d8" name="Current Savings" />
              <Line type="monotone" dataKey="projection" stroke="#82ca9d" name="Projected Growth" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="retirement-projection">
        <h3>Retirement Projection</h3>
        <div className="projection-details">
          <div className="detail-item">
            <span className="label">Current Age: </span>
            <span className="value">{personalInfo?.age}</span>
          </div>
          <div className="detail-item">
            <span className="label">Retirement Age: </span>
            <span className="value">{retirementAge}</span>
          </div>
          <div className="detail-item">
            <span className="label">Years to Retirement: </span>
            <span className="value">{retirementAge - personalInfo?.age}</span>
          </div>
          <div className="detail-item">
            <span className="label">Current Retirement Savings: </span>
            <span className="value">{formatCurrency(financialData.savings.retirement)}</span>
          </div>
          <div className="detail-item">
            <span className="label">Monthly Contribution Needed: </span>
            <span className="value">{formatCurrency(Math.round((financialData.income.total - financialData.expenses.total) * 0.15))}</span>
          </div>
          <div className="detail-item">
            <span className="label">Projected Retirement Corpus: </span>
            <span className="value">{formatCurrency(retirementSavings)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectionsTab;

// --- Usage Example ---
// import ProjectionsTab from "./components/FinancialPlanning/ProjectionsTab";
// ...
// {activeTab === "projections" && (
//   <ProjectionsTab
//     getSavingsProjection={getSavingsProjection}
//     formatChartValue={formatChartValue}
//     formatCurrency={formatCurrency}
//     retirementAge={retirementAge}
//     retirementSavings={retirementSavings}
//     financialData={financialData}
//   />
// )}
