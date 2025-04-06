import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const formData = await request.json();

        // Extract relevant data for analysis
        const {
            age,
            gender,
            maritalStatus,
            dependents,
            monthlySalary,
            otherIncome,
            monthlyExpenses,
            loanEMIs,
            insurancePremiums,
            currentSavings,
            investments,
            propertyValue,
            retirementAge,
            financialGoals,
            additionalExpenses,
            additionalAssets
        } = formData;

        // Calculate key financial metrics
        const totalIncome = Number(monthlySalary) + Number(otherIncome);
        const totalExpenses = Number(monthlyExpenses) + Number(loanEMIs) + Number(insurancePremiums) +
            additionalExpenses.reduce((sum: number, expense: any) => sum + Number(expense.amount), 0);
        const totalAssets = Number(currentSavings) + Number(investments) + Number(propertyValue) +
            additionalAssets.reduce((sum: number, asset: any) => sum + Number(asset.value), 0);
        const savingsRate = ((totalIncome - totalExpenses) / totalIncome) * 100;
        const yearsToRetirement = Number(retirementAge) - Number(age);

        // Generate insights based on financial metrics
        const insights = [];

        // Savings rate analysis
        if (savingsRate < 20) {
            insights.push(`Your savings rate of ${savingsRate.toFixed(1)}% is below the recommended 20%. Consider reducing discretionary spending.`);
        } else if (savingsRate >= 20 && savingsRate < 30) {
            insights.push(`Your savings rate of ${savingsRate.toFixed(1)}% is good, but there's room for improvement.`);
        } else {
            insights.push(`Excellent! Your savings rate of ${savingsRate.toFixed(1)}% is well above the recommended 20%.`);
        }

        // Debt analysis
        if (Number(loanEMIs) > 0) {
            const debtToIncome = (Number(loanEMIs) / totalIncome) * 100;
            if (debtToIncome > 40) {
                insights.push(`Your debt-to-income ratio of ${debtToIncome.toFixed(1)}% is high. Focus on debt reduction.`);
            } else if (debtToIncome > 20) {
                insights.push(`Your debt-to-income ratio of ${debtToIncome.toFixed(1)}% is manageable but could be improved.`);
            }
        }

        // Retirement analysis
        const monthlyRetirementSavings = (Number(financialGoals) - totalAssets) / (yearsToRetirement * 12);
        if (monthlyRetirementSavings > 0) {
            insights.push(`To reach your retirement goal, you need to save ₹${Math.round(monthlyRetirementSavings).toLocaleString()} monthly.`);
        }

        // Asset allocation analysis
        const equityPercentage = Math.max(100 - Number(age), 50);
        const debtPercentage = Math.min(Number(age), 40);
        insights.push(`Based on your age, consider allocating ${equityPercentage}% to equity, ${debtPercentage}% to debt, and 10% to gold.`);

        // Insurance analysis
        if (Number(insurancePremiums) === 0) {
            insights.push('Consider getting health and life insurance coverage for financial security.');
        }

        // Additional expenses analysis
        const discretionaryExpenses = additionalExpenses
            .filter((expense: any) => ['Entertainment', 'Shopping'].includes(expense.category))
            .reduce((sum: number, expense: any) => sum + Number(expense.amount), 0);
        
        if (discretionaryExpenses > totalIncome * 0.2) {
            insights.push('Your discretionary spending seems high. Consider reviewing non-essential expenses.');
        }

        // Return the insights
        return NextResponse.json({ insights });
    } catch (error) {
        console.error('Error analyzing finances:', error);
        return NextResponse.json(
            { error: 'Failed to analyze financial data' },
            { status: 500 }
        );
    }
} 