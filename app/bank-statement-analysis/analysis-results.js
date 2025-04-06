// components/AnalysisResults.js
import React, { useState } from 'react';
// import { Chart } from 'react-chartjs-2';
import { saveAs } from 'file-saver';

const AnalysisResults = ({ analysis, onReset }) => {
    const [activeTab, setActiveTab] = useState('summary');

    const downloadExcel = async () => {
        try {
            const response = await fetch('/api/download-excel');
            const blob = await response.blob();
            saveAs(blob, 'bank_statement_analysis.xlsx');
        } catch (error) {
            console.error('Error downloading Excel:', error);
            alert('Error downloading Excel file');
        }
    };

    const renderSummary = () => {
        return (
            <div className="summary-section">
                <div className="summary-cards">
                    <div className="summary-card">
                        <h3>Total Income</h3>
                        <p className="income">${analysis.totalIncome.toFixed(2)}</p>
                    </div>
                    <div className="summary-card">
                        <h3>Total Expenses</h3>
                        <p className="expense">${analysis.totalExpense.toFixed(2)}</p>
                    </div>
                    <div className="summary-card">
                        <h3>Net</h3>
                        <p className={analysis.totalIncome - analysis.totalExpense >= 0 ? "income" : "expense"}>
                            ${(analysis.totalIncome - analysis.totalExpense).toFixed(2)}
                        </p>
                    </div>
                    <div className="summary-card">
                        <h3>Transactions</h3>
                        <p>{analysis.totalTransactions}</p>
                    </div>
                </div>

                <div className="chart-container">
                    <h3>Spending by Category</h3>
                    <div className="chart">
                        {/* Placeholder for chart - in a real app, you'd render a chart here */}
                        <div className="chart-placeholder">
                            {Object.entries(analysis.categories).map(([category, amount]) => (
                                <div key={category} className="category-bar">
                                    <div className="category-name">{category}</div>
                                    <div
                                        className="category-value"
                                        style={{ width: `${(amount / analysis.totalExpense) * 100}%` }}
                                    >
                                        ${amount.toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderTransactions = () => {
        return (
            <div className="transactions-section">
                <h3>Largest Transactions</h3>
                <table className="transactions-table">
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Amount</th>
                    </tr>
                    </thead>
                    <tbody>
                    {analysis.largestTransactions.map((transaction, index) => (
                        <tr key={index}>
                            <td>{transaction.date}</td>
                            <td>{transaction.description}</td>
                            <td>{transaction.category}</td>
                            <td className={transaction.amount >= 0 ? "income" : "expense"}>
                                ${Math.abs(transaction.amount).toFixed(2)}
                                {transaction.amount >= 0 ? ' (Income)' : ' (Expense)'}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderMonthly = () => {
        return (
            <div className="monthly-section">
                <h3>Monthly Breakdown</h3>
                <div className="monthly-chart">
                    {/* Placeholder for monthly chart */}
                    <table className="monthly-table">
                        <thead>
                        <tr>
                            <th>Month</th>
                            <th>Income</th>
                            <th>Expenses</th>
                            <th>Net</th>
                        </tr>
                        </thead>
                        <tbody>
                        {Object.entries(analysis.monthlyBreakdown).map(([month, data]) => (
                            <tr key={month}>
                                <td>{month}</td>
                                <td className="income">${data.income.toFixed(2)}</td>
                                <td className="expense">${data.expense.toFixed(2)}</td>
                                <td className={data.income - data.expense >= 0 ? "income" : "expense"}>
                                    ${(data.income - data.expense).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className="analysis-results">
            <div className="results-header">
                <h2>Analysis Results</h2>
                <div className="actions">
                    <button onClick={downloadExcel} className="download-button">
                        Download Excel
                    </button>
                    <button onClick={onReset} className="reset-button">
                        Analyze Another Statement
                    </button>
                </div>
            </div>

            <div className="tabs">
                <button
                    className={activeTab === 'summary' ? 'active' : ''}
                    onClick={() => setActiveTab('summary')}
                >
                    Summary
                </button>
                <button
                    className={activeTab === 'transactions' ? 'active' : ''}
                    onClick={() => setActiveTab('transactions')}
                >
                    Transactions
                </button>
                <button
                    className={activeTab === 'monthly' ? 'active' : ''}
                    onClick={() => setActiveTab('monthly')}
                >
                    Monthly Breakdown
                </button>
            </div>

            <div className="tab-content">
                {activeTab === 'summary' && renderSummary()}
                {activeTab === 'transactions' && renderTransactions()}
                {activeTab === 'monthly' && renderMonthly()}
            </div>

            <style jsx>{`
        .analysis-results {
          width: 100%;
          max-width: 1000px;
          margin: 0 auto;
        }
        
        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .actions {
          display: flex;
          gap: 10px;
        }
        
        .download-button, .reset-button {
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .download-button {
          background-color: #4CAF50;
          color: white;
          border: none;
        }
        
        .reset-button {
          background-color: #f5f5f5;
          border: 1px solid #ddd;
        }
        
        .tabs {
          display: flex;
          border-bottom: 1px solid #ddd;
          margin-bottom: 20px;
        }
        
        .tabs button {
          padding: 10px 20px;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
        }
        
        .tabs button.active {
          border-bottom: 2px solid #007BFF;
          font-weight: bold;
        }
        
        .summary-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .summary-card {
          background-color: #f9f9f9;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .summary-card h3 {
          margin-top: 0;
          color: #555;
        }
        
        .summary-card p {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 0;
        }
        
        .income {
          color: #4CAF50;
        }
        
        .expense {
          color: #F44336;
        }
        
        .chart-container {
          margin-top: 30px;
        }
        
        .category-bar {
          display: flex;
          margin-bottom: 10px;
          align-items: center;
        }
        
        .category-name {
          width: 120px;
          font-weight: bold;
        }
        
        .category-value {
          background-color: #007BFF;
          color: white;
          padding: 5px 10px;
          border-radius: 4px;
        }
        
        .transactions-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .transactions-table th, .transactions-table td {
          padding: 10px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        
        .monthly-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .monthly-table th, .monthly-table td {
          padding: 10px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
      `}</style>
        </div>
    );
};

export default AnalysisResults;
