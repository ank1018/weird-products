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
    
    // Create update object with only defined values
    const updateObj: any = {};
    if (data !== undefined) updateObj.data = data;
    if (personalInfo !== undefined) updateObj.personalInfo = personalInfo;
    if (retirementAge !== undefined) updateObj.retirementAge = retirementAge;
    
    // Only update if there's something to update
    if (Object.keys(updateObj).length === 0) {
        return NextResponse.json({ message: 'No data to update' });
    }
    
    const updated = await FinancialData.findOneAndUpdate(
        { userEmail: session.user.email },
        { $set: updateObj },  // Use $set to only update provided fields
        { upsert: true, new: true }
    );
    
    return NextResponse.json({
        data: updated.data,
        personalInfo: updated.personalInfo,
        retirementAge: updated.retirementAge,
    });
}