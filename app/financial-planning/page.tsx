"use client";
import React, { useState } from 'react';
import FinancialPlanningForm from './components/financial-planning-form';
import FinancialRecommendations from './components/financial-recommendations';
import './styles.css';
import './components/financial-recommendations.css';

interface FormData {
    age: string;
    gender: string;
    maritalStatus: string;
    dependents: string;
    monthlySalary: string;
    otherIncome: string;
    monthlyExpenses: string;
    loanEMIs: string;
    insurancePremiums: string;
    currentSavings: string;
    investments: string;
    propertyValue: string;
    retirementAge: string;
    financialGoals: string;
    additionalExpenses: { category: string; amount: string }[];
    additionalAssets: { type: string; value: string }[];
}

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
}

export default function FinancialPlanningPage() {
    const [recommendations, setRecommendations] = useState<Recommendations | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const analyzeWithAI = async (formData: FormData) => {
        try {
            const response = await fetch('/api/analyze-finances', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('AI analysis failed');
            }

            const data = await response.json();
            return data.insights;
        } catch (error) {
            console.error('AI analysis error:', error);
            return [];
        }
    };

    const calculateRecommendations = async (formData: FormData): Promise<Recommendations> => {
        setIsLoading(true);
        
        // Convert string values to numbers
        const data = {
            ...formData,
            age: Number(formData.age),
            monthlySalary: Number(formData.monthlySalary),
            otherIncome: Number(formData.otherIncome) || 0,
            monthlyExpenses: Number(formData.monthlyExpenses),
            loanEMIs: Number(formData.loanEMIs) || 0,
            insurancePremiums: Number(formData.insurancePremiums) || 0,
            currentSavings: Number(formData.currentSavings),
            investments: Number(formData.investments) || 0,
            propertyValue: Number(formData.propertyValue) || 0,
            retirementAge: Number(formData.retirementAge),
            financialGoals: Number(formData.financialGoals) || 0
        };

        // Calculate total monthly income
        const totalMonthlyIncome = data.monthlySalary + data.otherIncome;

        // Calculate total monthly expenses including additional expenses
        const additionalExpensesTotal = formData.additionalExpenses.reduce((sum, expense) => 
            sum + (Number(expense.amount) || 0), 0);
        const totalMonthlyExpenses = data.monthlyExpenses + data.loanEMIs + 
            data.insurancePremiums + additionalExpensesTotal;

        // Calculate total assets including additional assets
        const additionalAssetsTotal = formData.additionalAssets.reduce((sum, asset) => 
            sum + (Number(asset.value) || 0), 0);
        const totalAssets = data.currentSavings + data.investments + 
            data.propertyValue + additionalAssetsTotal;

        // Calculate emergency fund (6 months of expenses)
        const emergencyFund = totalMonthlyExpenses * 6;

        // Calculate retirement corpus needed (assuming 4% withdrawal rate)
        const yearsToRetirement = data.retirementAge - data.age;
        const monthlyExpensesInRetirement = totalMonthlyExpenses * 1.5; // Assuming 50% higher expenses in retirement
        const annualExpensesInRetirement = monthlyExpensesInRetirement * 12;
        const retirementCorpus = annualExpensesInRetirement * 25; // 4% withdrawal rate

        // Calculate monthly savings required for retirement
        const monthlySavings = (retirementCorpus - totalAssets) / (yearsToRetirement * 12);

        // Calculate insurance needs
        const lifeInsurance = totalMonthlyExpenses * 12 * 10; // 10 years of expenses
        const healthInsurance = 500000; // Base health insurance coverage

        // Calculate investment allocation based on age
        const equityPercentage = Math.max(100 - data.age, 50); // At least 50% in equity
        const debtPercentage = Math.min(data.age, 40); // Up to 40% in debt
        const goldPercentage = 10; // 10% in gold

        // Generate personalized advice
        const advice = [
            `Save at least 20% of your monthly income (₹${Math.round(totalMonthlyIncome * 0.2).toLocaleString()})`,
            `Build an emergency fund of ₹${emergencyFund.toLocaleString()}`,
            `Consider increasing your health insurance coverage to ₹${healthInsurance.toLocaleString()}`,
            `Review your life insurance coverage to ensure it's at least ₹${lifeInsurance.toLocaleString()}`,
            `Focus on paying off high-interest debt if any`
        ];

        if (data.loanEMIs > 0) {
            advice.push(`Consider debt consolidation if you have multiple loans`);
        }

        if (data.currentSavings < emergencyFund) {
            advice.push(`Prioritize building your emergency fund before other investments`);
        }

        if (monthlySavings > 0) {
            advice.push(`Start saving ₹${Math.round(monthlySavings).toLocaleString()} monthly for retirement`);
        }

        // Get AI insights
        const aiInsights = await analyzeWithAI(formData);

        setIsLoading(false);
        return {
            emergencyFund,
            retirementCorpus,
            monthlySavings,
            lifeInsurance,
            healthInsurance,
            investmentAllocation: {
                equity: equityPercentage,
                debt: debtPercentage,
                gold: goldPercentage
            },
            advice,
            aiInsights
        };
    };

    const handleFormSubmit = async (formData: FormData) => {
        const recommendations = await calculateRecommendations(formData);
        setRecommendations(recommendations);
    };

    return (
        <div className="financial-planning-page">
            <h1>Financial Planning Calculator</h1>
            <p className="page-description">
                Enter your financial details to get personalized recommendations for savings,
                investments, and insurance to achieve your financial goals.
            </p>
            
            <FinancialPlanningForm onSubmit={handleFormSubmit} />
            
            {isLoading && (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Analyzing your financial data...</p>
                </div>
            )}
            
            {recommendations && (
                <FinancialRecommendations recommendations={recommendations} />
            )}
        </div>
    );
} 