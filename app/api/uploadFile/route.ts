// app/api/uploadFile/route.ts

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {processFile} from "./processFile";

// Ensure we use the Node.js runtime for fs support.
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    try {
        // Create uploads directory in public folder if it doesn't exist
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        console.log('Uploads directory:', uploadsDir);

        // Parse form data
        const data = await request.formData();
        const file = data.get('file') as File;
        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Generate a unique filename
        const fileId = Date.now().toString();
        const fileExtension = path.extname(file.name);
        const fileName = fileId + fileExtension;
        const filePath = path.join(uploadsDir, fileName);

        // Save the uploaded file
        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(filePath, buffer);
        console.log(`Saved file: ${filePath}`);

        // Get password if provided
        const password = (data.get('password') as string) || '';

        // Process the file
        const analysisResult = await processFile(filePath, fileExtension, password);

        // Return the public URL for the analysis file
        const analysisFileUrl = `/uploads/${analysisResult.analysisFileName}`;

        return NextResponse.json({
            message: 'File processed successfully',
            fileName: file.name,
            fileId: fileName,
            analysisResult: {
                ...analysisResult,
                analysisFileUrl
            },
        }, { status: 200 });
    } catch (error) {
        console.error('Error processing file:', error);
        return NextResponse.json({ 
            error: 'Failed to process file',
            details: error.message 
        }, { status: 500 });
    }
}
