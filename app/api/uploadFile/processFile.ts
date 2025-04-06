import fs from "fs";
import * as XLSX from 'xlsx';
import path from "path";

// Enhanced predefined categories and their keywords
const CATEGORIES = {
    'Income': ['salary', 'payroll', 'income', 'deposit', 'refund', 'interest', 'dividend', 'credit', 'payment received'],
    'Housing': ['rent', 'mortgage', 'property', 'home', 'apartment', 'housing', 'real estate', 'landlord'],
    'Utilities': ['electric', 'water', 'gas', 'internet', 'phone', 'utility', 'bill', 'cable', 'tv', 'streaming'],
    'Transportation': ['uber', 'lyft', 'taxi', 'train', 'bus', 'transit', 'gas', 'fuel', 'parking', 'toll', 'car', 'auto', 'vehicle'],
    'Food & Dining': ['restaurant', 'cafe', 'coffee', 'food', 'grocery', 'market', 'dining', 'takeout', 'delivery', 'meal', 'eat', 'drink'],
    'Shopping': ['store', 'shop', 'mall', 'retail', 'amazon', 'ebay', 'walmart', 'target', 'purchase', 'buy', 'sale'],
    'Entertainment': ['movie', 'cinema', 'theater', 'netflix', 'spotify', 'game', 'entertainment', 'concert', 'show', 'event'],
    'Health': ['medical', 'hospital', 'doctor', 'pharmacy', 'health', 'dental', 'fitness', 'gym', 'clinic', 'insurance', 'wellness'],
    'Education': ['tuition', 'school', 'university', 'college', 'book', 'course', 'education', 'learning', 'student'],
    'Personal Care': ['hair', 'salon', 'spa', 'beauty', 'grooming', 'personal care', 'cosmetic', 'makeup'],
    'Travel': ['hotel', 'flight', 'airbnb', 'vacation', 'travel', 'trip', 'airline', 'resort', 'tour'],
    'Insurance': ['insurance', 'premium', 'coverage', 'policy', 'life insurance', 'health insurance', 'car insurance'],
    'Investments': ['investment', 'stock', 'trade', 'brokerage', 'retirement', 'fund', 'portfolio', 'savings'],
    'Subscriptions': ['subscription', 'membership', 'monthly', 'annual', 'fee', 'renewal', 'auto-renew'],
    'Transfers': ['transfer', 'send', 'receive', 'payment', 'venmo', 'paypal', 'zelle', 'wire', 'ach'],
    'Other': [] // Default category
};

export async function processFile(filePath: string, fileType: string, password = '') {
    console.log(`Processing file: ${filePath}, Type: ${fileType}, Password: ${password}`);

    let workbook;
    try {
        const fileBuffer = fs.readFileSync(filePath);
        workbook = XLSX.read(fileBuffer, { type: 'buffer', password });
    } catch (error) {
        console.error('Error reading workbook:', error);
        throw new Error('Failed to read workbook');
    }

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: '' });

    const normalizedData = jsonData.map((row: any) => {
        const normalizedRow: any = {};
        Object.keys(row).forEach(key => {
            const lowerKey = key.toLowerCase();
            if (lowerKey.includes('date') || lowerKey.includes('time')) {
                normalizedRow.date = row[key];
            } else if (lowerKey.includes('desc') || lowerKey.includes('narration') || lowerKey.includes('particular')) {
                normalizedRow.description = row[key];
            } else if (lowerKey.includes('debit') || lowerKey.includes('withdrawal') || lowerKey.includes('payment')) {
                normalizedRow.debit = parseFloat(row[key]) || 0;
            } else if (lowerKey.includes('credit') || lowerKey.includes('deposit')) {
                normalizedRow.credit = parseFloat(row[key]) || 0;
            } else if (lowerKey.includes('balance') || lowerKey.includes('avail')) {
                normalizedRow.balance = parseFloat(row[key]) || 0;
            } else if (lowerKey.includes('amount')) {
                const amount = parseFloat(row[key]) || 0;
                if (amount < 0) {
                    normalizedRow.debit = Math.abs(amount);
                    normalizedRow.credit = 0;
                } else {
                    normalizedRow.credit = amount;
                    normalizedRow.debit = 0;
                }
            } else {
                normalizedRow[key] = row[key];
            }
        });
        return normalizedRow;
    });

    // Perform enhanced local analysis
    const analysis = analyzeTransactionsWithRules(normalizedData);

    // Create a new workbook with the analysis results
    const newWorkbook = XLSX.utils.book_new();
    const analysisSheet = XLSX.utils.json_to_sheet([analysis.summary]);
    XLSX.utils.book_append_sheet(newWorkbook, analysisSheet, 'Summary');

    // Add categorized transactions sheet
    const categorizedSheet = XLSX.utils.json_to_sheet(analysis.categorizedTransactions);
    XLSX.utils.book_append_sheet(newWorkbook, categorizedSheet, 'Categorized');

    // Write the analysis workbook to disk
    const analysisFileName = path.basename(filePath, fileType) + '-analysis.xls';
    const analysisFilePath = path.join(path.dirname(filePath), analysisFileName);
    
    try {
        const dir = path.dirname(analysisFilePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        const buffer = XLSX.write(newWorkbook, { type: 'buffer', bookType: 'biff8' });
        fs.writeFileSync(analysisFilePath, buffer);
        console.log(`Analysis file written to: ${analysisFilePath}`);
    } catch (error) {
        console.error('Error writing analysis file:', error);
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (cleanupError) {
            console.error('Error cleaning up file:', cleanupError);
        }
        throw new Error(`Failed to write analysis file: ${error.message}`);
    }

    return {
        rawData: normalizedData,
        analysis: analysis.summary,
        categories: analysis.categories,
        monthlySummary: analysis.monthlySummary,
        categorizedTransactions: analysis.categorizedTransactions,
        analysisFileName
    };
}

function analyzeTransactionsWithRules(transactions: any[]) {
    // Sort transactions by date
    const sortedTransactions = [...transactions].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
    });

    // Calculate basic metrics
    let totalDebit = 0;
    let totalCredit = 0;
    let largestDebit = { amount: 0, transaction: null };
    let largestCredit = { amount: 0, transaction: null };

    // Track monthly statistics
    const monthlyStats: {[key: string]: {totalDebit: number, totalCredit: number, count: number}} = {};
    const categoryStats: {[key: string]: {total: number, count: number, transactions: any[]}} = {};

    // Initialize category stats
    Object.keys(CATEGORIES).forEach(category => {
        categoryStats[category] = { total: 0, count: 0, transactions: [] };
    });

    // Process each transaction
    sortedTransactions.forEach(transaction => {
        const debit = transaction.debit || 0;
        const credit = transaction.credit || 0;

        totalDebit += debit;
        totalCredit += credit;

        if (debit > largestDebit.amount) {
            largestDebit = { amount: debit, transaction };
        }
        if (credit > largestCredit.amount) {
            largestCredit = { amount: credit, transaction };
        }

        // Monthly tracking
        const date = new Date(transaction.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        if (!monthlyStats[monthKey]) {
            monthlyStats[monthKey] = { totalDebit: 0, totalCredit: 0, count: 0 };
        }

        monthlyStats[monthKey].totalDebit += debit;
        monthlyStats[monthKey].totalCredit += credit;
        monthlyStats[monthKey].count++;

        // Enhanced categorization
        const description = (transaction.description || '').toLowerCase();
        let category = 'Other';
        let confidence = 0;

        for (const [cat, keywords] of Object.entries(CATEGORIES)) {
            const matches = keywords.filter(keyword => description.includes(keyword)).length;
            if (matches > confidence) {
                confidence = matches;
                category = cat;
            }
        }

        // Update category stats
        categoryStats[category].total += debit;
        categoryStats[category].count++;
        categoryStats[category].transactions.push(transaction);
    });

    // Transform monthly stats
    const monthlySummary = Object.entries(monthlyStats).map(([month, stats]) => ({
        month,
        totalDebit: stats.totalDebit,
        totalCredit: stats.totalCredit,
        netCashflow: stats.totalCredit - stats.totalDebit,
        transactionCount: stats.count
    })).sort((a, b) => a.month.localeCompare(b.month));

    // Transform category stats with enhanced insights
    const categorySummary = Object.entries(categoryStats).map(([category, stats]) => ({
        category,
        totalAmount: stats.total,
        transactionCount: stats.count,
        percentage: totalDebit > 0 ? (stats.total / totalDebit) * 100 : 0,
        averageTransaction: stats.count > 0 ? stats.total / stats.count : 0,
        largestTransaction: stats.transactions.length > 0 ? 
            Math.max(...stats.transactions.map(t => t.debit || 0)) : 0
    }));

    return {
        summary: {
            totalDebit,
            totalCredit,
            netCashflow: totalCredit - totalDebit,
            transactionCount: sortedTransactions.length,
            startDate: sortedTransactions.length > 0 ? sortedTransactions[0].date : null,
            endDate: sortedTransactions.length > 0 ? sortedTransactions[sortedTransactions.length - 1].date : null,
            averageTransaction: sortedTransactions.length > 0 ? (totalDebit + totalCredit) / sortedTransactions.length : 0,
            largestExpense: largestDebit.transaction ? {
                amount: largestDebit.amount,
                date: largestDebit.transaction.date,
                description: largestDebit.transaction.description
            } : null,
            largestIncome: largestCredit.transaction ? {
                amount: largestCredit.amount,
                date: largestCredit.transaction.date,
                description: largestCredit.transaction.description
            } : null,
            insights: generateEnhancedInsights(categorySummary, monthlySummary)
        },
        categories: categorySummary,
        monthlySummary,
        categorizedTransactions: sortedTransactions.map(t => ({
            ...t,
            category: categorizeTransaction(t.description)
        }))
    };
}

function categorizeTransaction(description: string): string {
    const desc = (description || '').toLowerCase();
    let category = 'Other';
    let confidence = 0;

    for (const [cat, keywords] of Object.entries(CATEGORIES)) {
        const matches = keywords.filter(keyword => desc.includes(keyword)).length;
        if (matches > confidence) {
            confidence = matches;
            category = cat;
        }
    }
    return category;
}

function generateEnhancedInsights(categorySummary: any[], monthlySummary: any[]): string {
    const insights = [];
    
    // Spending patterns
    const topCategories = categorySummary
        .filter(c => c.category !== 'Income')
        .sort((a, b) => b.totalAmount - a.totalAmount)
        .slice(0, 3);
    
    if (topCategories.length > 0) {
        insights.push(`Your top spending categories are: ${topCategories.map(c => `${c.category} (${c.percentage.toFixed(1)}%)`).join(', ')}`);
    }

    // Monthly trends
    if (monthlySummary.length > 1) {
        const firstMonth = monthlySummary[0];
        const lastMonth = monthlySummary[monthlySummary.length - 1];
        const spendingChange = ((lastMonth.totalDebit - firstMonth.totalDebit) / firstMonth.totalDebit) * 100;
        
        if (Math.abs(spendingChange) > 10) {
            insights.push(`Your spending has ${spendingChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(spendingChange).toFixed(1)}% over the period.`);
        }
    }

    // Recurring expenses analysis
    const recurringCategories = ['Subscriptions', 'Utilities', 'Insurance', 'Housing'];
    const recurringExpenses = categorySummary
        .filter(c => recurringCategories.includes(c.category))
        .reduce((sum, c) => sum + c.totalAmount, 0);
    
    if (recurringExpenses > 0) {
        const monthlyRecurring = recurringExpenses / monthlySummary.length;
        insights.push(`You spend an average of ${monthlyRecurring.toFixed(2)} per month on recurring expenses (${(monthlyRecurring / (totalDebit / monthlySummary.length) * 100).toFixed(1)}% of your monthly spending).`);
    }

    // Savings potential
    const discretionaryCategories = ['Entertainment', 'Shopping', 'Food & Dining'];
    const discretionarySpending = categorySummary
        .filter(c => discretionaryCategories.includes(c.category))
        .reduce((sum, c) => sum + c.totalAmount, 0);
    
    if (discretionarySpending > 0) {
        insights.push(`You spend ${discretionarySpending.toFixed(2)} on discretionary categories. Consider setting a budget for these expenses.`);
    }

    // Income analysis
    const incomeCategory = categorySummary.find(c => c.category === 'Income');
    if (incomeCategory && incomeCategory.totalAmount > 0) {
        const savingsRate = ((totalCredit - totalDebit) / totalCredit) * 100;
        insights.push(`Your savings rate is ${savingsRate.toFixed(1)}% of your income.`);
    }

    return insights.join('\n\n');
}
