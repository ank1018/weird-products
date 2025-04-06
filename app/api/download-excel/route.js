// pages/api/download-excel.js
// import path from 'path';
// import fs from 'fs';
import xlsx from 'xlsx';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // In a real app, you'd get the user's session to find their results
        // For this example, we'll create a new Excel file with the analysis results
        const analysisData = req.session?.analysis || {
            totalIncome: 0,
            totalExpense: 0,
            categories: {},
            monthlyBreakdown: {},
            largestTransactions: []
        };

        // Create workbook
        const wb = xlsx.utils.book_new();

        // Create summary sheet
        const summaryData = [
            ['Bank Statement Analysis Summary'],
            [],
            ['Total Income', analysisData.totalIncome],
            ['Total Expenses', analysisData.totalExpense],
            ['Net', analysisData.totalIncome - analysisData.totalExpense],
            ['Total Transactions', analysisData.totalTransactions],
            [],
            ['Categories'],
        ];

        // Add categories to summary
        Object.entries(analysisData.categories).forEach(([category, amount]) => {
            summaryData.push([category, amount]);
        });

        const summarySheet = xlsx.utils.aoa_to_sheet(summaryData);
        xlsx.utils.book_append_sheet(wb, summarySheet, 'Summary');

        // Create transactions sheet
        const transactionsData = [
            ['Date', 'Description', 'Category', 'Amount']
        ];

        analysisData.largestTransactions.forEach(transaction => {
            transactionsData.push([
                transaction.date,
                transaction.description,
                transaction.category,
                transaction.amount
            ]);
        });

        const transactionsSheet = xlsx.utils.aoa_to_sheet(transactionsData);
        xlsx.utils.book_append_sheet(wb, transactionsSheet, 'Transactions');

        // Create monthly sheet
        const monthlyData = [
            ['Month', 'Income', 'Expenses', 'Net']
        ];

        Object.entries(analysisData.monthlyBreakdown).forEach(([month, data]) => {
            monthlyData.push([
                month,
                data.income,
                data.expense,
                data.income - data.expense
            ]);
        });

        const monthlySheet = xlsx.utils.aoa_to_sheet(monthlyData);
        xlsx.utils.book_append_sheet(wb, monthlySheet, 'Monthly');

        // Write to buffer
        const buf = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

        // Set response headers
        res.setHeader('Content-Disposition', 'attachment; filename=bank_statement_analysis.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        // Send buffer
        res.send(buf);
    } catch (error) {
        console.error('Error generating Excel:', error);
        return res.status(500).json({ error: 'Error generating Excel file' });
    }
}
