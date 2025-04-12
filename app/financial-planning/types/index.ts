export interface FinancialData {
    income: {
        salary: number;
        other: number;
    };
    expenses: {
        housing: number;
        utilities: number;
        food: number;
        transportation: number;
        healthcare: number;
        entertainment: number;
        other: number;
    };
    savings: {
        emergency: number;
        retirement: number;
        other: number;
    };
    investments: {
        stocks: number;
        bonds: number;
        realEstate: number;
        other: number;
    };
    debt: {
        mortgage: number;
        car: number;
        student: number;
        creditCard: number;
        other: number;
    };
    goals: {
        shortTerm: number;
        mediumTerm: number;
        longTerm: number;
    };
}

export interface Recommendations {
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
    monthlyIncome: number;
    monthlyExpenses: number;
}

export interface FormData {
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