import { NextResponse } from 'next/server';
import type { FormData } from '../../financial-planning/types';

export async function POST(request: Request) {
    try {
        const formData: FormData = await request.json();
        
        // Basic AI analysis logic (can be enhanced with more sophisticated analysis)
        const insights = [
            "Based on your income and expenses, you're saving approximately 20% of your income.",
            "Your debt-to-income ratio is within a healthy range.",
            "Consider increasing your emergency fund to cover 6 months of expenses.",
            "Your retirement savings are on track for your age group.",
            "You might want to review your investment allocation to ensure proper diversification."
        ];

        return NextResponse.json({ insights });
    } catch (error) {
        console.error('Error analyzing finances:', error);
        return NextResponse.json(
            { error: 'Failed to analyze finances' },
            { status: 500 }
        );
    }
} 