import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Financial Planning | Finance 101',
    description: 'Access comprehensive financial planning tools, expert advice, and personalized insights for smart budgeting, saving, investing, and debt management. Transform your financial future with our robust financial data analysis.',
    keywords: 'financial planning, budgeting, saving, investing, debt management, financial insights, financial data',
    authors: [{ name: 'Your Company Name' }],
    openGraph: {
        title: 'Financial Planning | Finance 101',
        description: 'Access comprehensive financial planning tools, expert advice, and personalized insights for smart budgeting, saving, investing, and debt management.',
        type: 'website',
        url: 'https://www.wackyorwise.com/financial-planning',
        images: [],
    },
};

export default function FinancialPlanningLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
} 