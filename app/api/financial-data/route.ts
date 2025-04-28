import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import FinancialData from "../../financial-planning/models/financial-data.model";

export async function GET() {
    await connectDB();
    const session = await getServerSession();
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const doc = await FinancialData.findOne({ userEmail: session.user.email });
    return NextResponse.json({
        data: doc?.data || null,
        personalInfo: doc?.personalInfo || null,
        retirementAge: doc?.retirementAge || null,
    });
}

export async function POST(req: NextRequest) {
    await connectDB();
    const session = await getServerSession();
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data, personalInfo, retirementAge } = await req.json();
    const updated = await FinancialData.findOneAndUpdate(
        { userEmail: session.user.email },
        { data, personalInfo, retirementAge },
        { upsert: true, new: true }
    );
    return NextResponse.json({
        data: updated.data,
        personalInfo: updated.personalInfo,
        retirementAge: updated.retirementAge,
    });
}
