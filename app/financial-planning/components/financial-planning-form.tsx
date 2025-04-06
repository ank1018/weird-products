"use client";
import React, { useState } from 'react';

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

interface FinancialPlanningFormProps {
    onSubmit: (data: FormData) => void;
}

const salaryRanges = [
    { value: '25000', label: '₹25,000 - ₹50,000' },
    { value: '50000', label: '₹50,000 - ₹1,00,000' },
    { value: '100000', label: '₹1,00,000 - ₹2,00,000' },
    { value: '200000', label: '₹2,00,000 - ₹5,00,000' },
    { value: '500000', label: '₹5,00,000+' }
];

const expenseRanges = [
    { value: '10000', label: '₹10,000 - ₹20,000' },
    { value: '20000', label: '₹20,000 - ₹40,000' },
    { value: '40000', label: '₹40,000 - ₹80,000' },
    { value: '80000', label: '₹80,000 - ₹1,50,000' },
    { value: '150000', label: '₹1,50,000+' }
];

const assetTypes = [
    'Fixed Deposit',
    'Mutual Funds',
    'Stocks',
    'PPF',
    'NPS',
    'Gold',
    'Real Estate',
    'Other'
];

const expenseCategories = [
    'Rent',
    'Groceries',
    'Transportation',
    'Utilities',
    'Entertainment',
    'Healthcare',
    'Education',
    'Shopping',
    'Other'
];

export default function FinancialPlanningForm({ onSubmit }: FinancialPlanningFormProps) {
    const [formData, setFormData] = useState<FormData>({
        age: '',
        gender: '',
        maritalStatus: '',
        dependents: '',
        monthlySalary: '',
        otherIncome: '',
        monthlyExpenses: '',
        loanEMIs: '',
        insurancePremiums: '',
        currentSavings: '',
        investments: '',
        propertyValue: '',
        retirementAge: '',
        financialGoals: '',
        additionalExpenses: [],
        additionalAssets: []
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const addExpense = () => {
        setFormData(prev => ({
            ...prev,
            additionalExpenses: [...prev.additionalExpenses, { category: '', amount: '' }]
        }));
    };

    const addAsset = () => {
        setFormData(prev => ({
            ...prev,
            additionalAssets: [...prev.additionalAssets, { type: '', value: '' }]
        }));
    };

    const updateExpense = (index: number, field: 'category' | 'amount', value: string) => {
        setFormData(prev => {
            const newExpenses = [...prev.additionalExpenses];
            newExpenses[index] = { ...newExpenses[index], [field]: value };
            return { ...prev, additionalExpenses: newExpenses };
        });
    };

    const updateAsset = (index: number, field: 'type' | 'value', value: string) => {
        setFormData(prev => {
            const newAssets = [...prev.additionalAssets];
            newAssets[index] = { ...newAssets[index], [field]: value };
            return { ...prev, additionalAssets: newAssets };
        });
    };

    return (
        <form onSubmit={handleSubmit} className="financial-form">
            <div className="form-section">
                <h2>Personal Information</h2>
                <div className="form-group">
                    <label>Age</label>
                    <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                        min="18"
                        max="100"
                        placeholder="Enter your age"
                    />
                </div>
                <div className="form-group">
                    <label>Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} required>
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Marital Status</label>
                    <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} required>
                        <option value="">Select</option>
                        <option value="single">Single</option>
                        <option value="married">Married</option>
                        <option value="divorced">Divorced</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Number of Dependents</label>
                    <input
                        type="number"
                        name="dependents"
                        value={formData.dependents}
                        onChange={handleChange}
                        required
                        min="0"
                        max="10"
                        placeholder="Enter number of dependents"
                    />
                </div>
            </div>

            <div className="form-section">
                <h2>Income</h2>
                <div className="form-group">
                    <label>Monthly Salary (₹)</label>
                    <input
                        type="number"
                        name="monthlySalary"
                        value={formData.monthlySalary}
                        onChange={handleChange}
                        required
                        min="0"
                        step="1000"
                        placeholder="Enter your monthly salary"
                    />
                </div>
                <div className="form-group">
                    <label>Other Monthly Income (₹)</label>
                    <input
                        type="number"
                        name="otherIncome"
                        value={formData.otherIncome}
                        onChange={handleChange}
                        min="0"
                        step="1000"
                        placeholder="Enter other monthly income"
                    />
                </div>
            </div>

            <div className="form-section">
                <h2>Expenses</h2>
                <div className="form-group">
                    <label>Monthly Living Expenses (₹)</label>
                    <input
                        type="number"
                        name="monthlyExpenses"
                        value={formData.monthlyExpenses}
                        onChange={handleChange}
                        required
                        min="0"
                        step="1000"
                        placeholder="Enter monthly living expenses"
                    />
                </div>
                <div className="form-group">
                    <label>Loan EMIs (₹)</label>
                    <input
                        type="number"
                        name="loanEMIs"
                        value={formData.loanEMIs}
                        onChange={handleChange}
                        min="0"
                        step="1000"
                        placeholder="Enter total loan EMIs"
                    />
                </div>
                <div className="form-group">
                    <label>Insurance Premiums (₹)</label>
                    <input
                        type="number"
                        name="insurancePremiums"
                        value={formData.insurancePremiums}
                        onChange={handleChange}
                        min="0"
                        step="1000"
                        placeholder="Enter insurance premiums"
                    />
                </div>

                <div className="additional-items">
                    <h3>Additional Expenses</h3>
                    {formData.additionalExpenses.map((expense, index) => (
                        <div key={index} className="additional-item">
                            <select
                                value={expense.category}
                                onChange={(e) => updateExpense(index, 'category', e.target.value)}
                            >
                                <option value="">Select Category</option>
                                {expenseCategories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                            <input
                                type="number"
                                value={expense.amount}
                                onChange={(e) => updateExpense(index, 'amount', e.target.value)}
                                min="0"
                                step="1000"
                                placeholder="Amount (₹)"
                            />
                        </div>
                    ))}
                    <button type="button" onClick={addExpense} className="add-button">
                        + Add Expense
                    </button>
                </div>
            </div>

            <div className="form-section">
                <h2>Assets</h2>
                <div className="form-group">
                    <label>Current Savings (₹)</label>
                    <input
                        type="number"
                        name="currentSavings"
                        value={formData.currentSavings}
                        onChange={handleChange}
                        required
                        min="0"
                        step="1000"
                        placeholder="Enter current savings"
                    />
                </div>
                <div className="form-group">
                    <label>Investments (₹)</label>
                    <input
                        type="number"
                        name="investments"
                        value={formData.investments}
                        onChange={handleChange}
                        min="0"
                        step="1000"
                        placeholder="Enter total investments"
                    />
                </div>
                <div className="form-group">
                    <label>Property Value (₹)</label>
                    <input
                        type="number"
                        name="propertyValue"
                        value={formData.propertyValue}
                        onChange={handleChange}
                        min="0"
                        step="1000"
                        placeholder="Enter property value"
                    />
                </div>

                <div className="additional-items">
                    <h3>Additional Assets</h3>
                    {formData.additionalAssets.map((asset, index) => (
                        <div key={index} className="additional-item">
                            <select
                                value={asset.type}
                                onChange={(e) => updateAsset(index, 'type', e.target.value)}
                            >
                                <option value="">Select Asset Type</option>
                                {assetTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                            <input
                                type="number"
                                value={asset.value}
                                onChange={(e) => updateAsset(index, 'value', e.target.value)}
                                min="0"
                                step="1000"
                                placeholder="Value (₹)"
                            />
                        </div>
                    ))}
                    <button type="button" onClick={addAsset} className="add-button">
                        + Add Asset
                    </button>
                </div>
            </div>

            <div className="form-section">
                <h2>Goals</h2>
                <div className="form-group">
                    <label>Desired Retirement Age</label>
                    <input
                        type="number"
                        name="retirementAge"
                        value={formData.retirementAge}
                        onChange={handleChange}
                        required
                        min="50"
                        max="80"
                        placeholder="Enter desired retirement age"
                    />
                </div>
                <div className="form-group">
                    <label>Financial Goals (₹)</label>
                    <input
                        type="number"
                        name="financialGoals"
                        value={formData.financialGoals}
                        onChange={handleChange}
                        min="0"
                        step="1000"
                        placeholder="Enter target amount for future goals"
                    />
                </div>
            </div>

            <button type="submit" className="submit-button">
                Get Recommendations
            </button>
        </form>
    );
} 