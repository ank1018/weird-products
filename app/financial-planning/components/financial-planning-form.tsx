"use client";
import React, { useState } from 'react';
import SliderInput from './SliderInput';
import type { FormData } from '../types';

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
        monthlySalary: '50000',
        otherIncome: '0',
        monthlyExpenses: '30000',
        loanEMIs: '0',
        insurancePremiums: '0',
        currentSavings: '100000',
        investments: '0',
        propertyValue: '0',
        retirementAge: '60',
        financialGoals: '10000000',
        additionalExpenses: [],
        additionalAssets: []
    });

    const handleChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
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
                        onChange={(e) => handleChange('age', e.target.value)}
                        required
                        min="18"
                        max="100"
                        placeholder="Enter your age"
                    />
                </div>
                <div className="form-group">
                    <label>Gender</label>
                    <select name="gender" value={formData.gender} onChange={(e) => handleChange('gender', e.target.value)} required>
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Marital Status</label>
                    <select name="maritalStatus" value={formData.maritalStatus} onChange={(e) => handleChange('maritalStatus', e.target.value)} required>
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
                        onChange={(e) => handleChange('dependents', e.target.value)}
                        required
                        min="0"
                        max="10"
                        placeholder="Enter number of dependents"
                    />
                </div>
            </div>

            <div className="form-section">
                <h3>Income & Expenses</h3>
                <SliderInput
                    label="Monthly Salary"
                    value={formData.monthlySalary}
                    onChange={(value) => handleChange('monthlySalary', value)}
                    min={0}
                    max={1000000}
                    step={5000}
                    ranges={salaryRanges}
                />
                <SliderInput
                    label="Monthly Expenses"
                    value={formData.monthlyExpenses}
                    onChange={(value) => handleChange('monthlyExpenses', value)}
                    min={0}
                    max={500000}
                    step={5000}
                    ranges={expenseRanges}
                />
                <SliderInput
                    label="Loan EMIs"
                    value={formData.loanEMIs}
                    onChange={(value) => handleChange('loanEMIs', value)}
                    min={0}
                    max={100000}
                    step={1000}
                />
                <SliderInput
                    label="Insurance Premiums"
                    value={formData.insurancePremiums}
                    onChange={(value) => handleChange('insurancePremiums', value)}
                    min={0}
                    max={500000}
                    step={5000}
                />

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
                <SliderInput
                    label="Current Savings"
                    value={formData.currentSavings}
                    onChange={(value) => handleChange('currentSavings', value)}
                    min={0}
                    max={10000000}
                    step={10000}
                />
                <SliderInput
                    label="Investments"
                    value={formData.investments}
                    onChange={(value) => handleChange('investments', value)}
                    min={0}
                    max={5000000}
                    step={10000}
                />
                <SliderInput
                    label="Property Value"
                    value={formData.propertyValue}
                    onChange={(value) => handleChange('propertyValue', value)}
                    min={0}
                    max={50000000}
                    step={100000}
                />

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
                <SliderInput
                    label="Desired Retirement Age"
                    value={formData.retirementAge}
                    onChange={(value) => handleChange('retirementAge', value)}
                    min={40}
                    max={75}
                    step={1}
                />
                <SliderInput
                    label="Financial Goals"
                    value={formData.financialGoals}
                    onChange={(value) => handleChange('financialGoals', value)}
                    min={0}
                    max={100000000}
                    step={100000}
                />
            </div>

            <button type="submit" className="submit-button">
                Get Recommendations
            </button>
        </form>
    );
} 