export interface FinancialData {
  income: {
    salary: number;
    other: number;
    total: number;
  };
  expenses: {
    housing: number;
    transportation: number;
    food: number;
    utilities: number;
    entertainment: number;
    healthcare: number;
    education: number;
    debt: number;
    other: number;
    total: number;
  };
  savings: {
    emergency: number;
    retirement: number;
    investment: number;
    other: number;
    total: number;
  };
  investments: {
    stocks: number;
    bonds: number;
    realEstate: number;
    mutualFunds: number;
    crypto: number;
    other: number;
    total: number;
  };
  debt: {
    mortgage: { amount: number; interestRate: number };
    car: { amount: number; interestRate: number };
    student: { amount: number; interestRate: number };
    creditCard: { amount: number; interestRate: number };
    personal: { amount: number; interestRate: number };
    other: { amount: number; interestRate: number };
    total: number;
  };
  goals: {
    shortTerm: {
      amount: number;
      timeline: number;
      description: string;
    };
    mediumTerm: {
      amount: number;
      timeline: number;
      description: string;
    };
    longTerm: {
      amount: number;
      timeline: number;
      description: string;
    };
  };
} 