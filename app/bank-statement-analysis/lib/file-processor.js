// lib/fileProcessor.js
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';
import xlsx from 'xlsx';
import pdf from 'pdf-parse';
import csv from 'csv-parser';

const execPromise = util.promisify(exec);

export async function processFile(filePath, fileType, password = '') {
    try {
        // Step 1: Convert file to XLS if needed
        const xlsPath = await convertToXls(filePath, fileType, password);

        // Step 2: Extract and analyze data
        const analysisResult = await analyzeStatement(xlsPath);

        return {
            status: 'complete',
            xlsPath: path.basename(xlsPath),
            analysis: analysisResult
        };
    } catch (error) {
        console.error('Error in processFile:', error);
        throw new Error(`Failed to process file: ${error.message}`);
    }
}

async function convertToXls(filePath, fileType, password) {
    const outputPath = filePath.replace(/\.[^/.]+$/, '.xlsx');

    try {
        switch (fileType) {
            case '.pdf':
                await convertPdfToXls(filePath, outputPath, password);
                break;
            case '.csv':
                await convertCsvToXls(filePath, outputPath);
                break;
            case '.xlsx':
                // Already in desired format
                return filePath;
            case '.xls':
                // Already close to desired format, just convert to xlsx
                await convertXlsToXlsx(filePath, outputPath);
                break;
            default:
                throw new Error(`Unsupported file type: ${fileType}`);
        }

        return outputPath;
    } catch (error) {
        console.error(`Error converting ${fileType} to XLS:`, error);
        throw error;
    }
}

async function convertPdfToXls(pdfPath, outputPath, password) {
    // Handle password-protected PDFs
    let pdfData;
    let dataBuffer = fs.readFileSync(pdfPath);

    if (password) {
        // For password-protected PDFs, we'd use a library like pdf-lib or external tool
        // This is a simplified example
        const tempPath = `${pdfPath}_decrypted.pdf`;
        await execPromise(`qpdf --password=${password} --decrypt ${pdfPath} ${tempPath}`);
        dataBuffer = fs.readFileSync(tempPath);
        fs.unlinkSync(tempPath); // Clean up
    }

    pdfData = await pdf(dataBuffer);

    // Extract tabular data from PDF
    // This is a complex task requiring specialized libraries
    // For a real implementation, consider using Tabula, PDFPlumber, or a commercial API

    // For this example, we'll create a simple Excel file with the raw text
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.aoa_to_sheet([
        ['Raw PDF Content'],
        [pdfData.text]
    ]);
    xlsx.utils.book_append_sheet(wb, ws, 'PDF Extract');
    xlsx.writeFile(wb, outputPath);

    return outputPath;
}

async function convertCsvToXls(csvPath, outputPath) {
    return new Promise((resolve, reject) => {
        const rows = [];

        fs.createReadStream(csvPath)
            .pipe(csv())
            .on('data', (row) => {
                rows.push(row);
            })
            .on('end', () => {
                try {
                    const wb = xlsx.utils.book_new();
                    const ws = xlsx.utils.json_to_sheet(rows);
                    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
                    xlsx.writeFile(wb, outputPath);
                    resolve(outputPath);
                } catch (error) {
                    reject(error);
                }
            })
            .on('error', reject);
    });
}

async function convertXlsToXlsx(xlsPath, outputPath) {
    const workbook = xlsx.readFile(xlsPath);
    xlsx.writeFile(workbook, outputPath);
    return outputPath;
}

async function analyzeStatement(xlsPath) {
    // Read the Excel file
    const workbook = xlsx.readFile(xlsPath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    // This is where you'd implement your bank statement analysis logic
    // This will depend on the structure of the bank statements you're processing

    // Example analysis (assumes standard transaction data)
    const analysis = {
        totalTransactions: data.length,
        totalIncome: 0,
        totalExpense: 0,
        categories: {},
        monthlyBreakdown: {},
        largestTransactions: []
    };

    // Process each transaction
    data.forEach(row => {
        // This is a simplified example - you'll need to adapt to your actual data structure
        const amount = parseFloat(row.Amount || row.amount || row.AMOUNT || 0);
        const date = row.Date || row.date || row.DATE || '';
        const description = row.Description || row.description || row.DESC || '';

        if (!isNaN(amount)) {
            // Categorize as income or expense
            if (amount > 0) {
                analysis.totalIncome += amount;
            } else {
                analysis.totalExpense += Math.abs(amount);
            }

            // Extract month for monthly breakdown
            const month = date.split('/')[0] || 'Unknown';
            if (!analysis.monthlyBreakdown[month]) {
                analysis.monthlyBreakdown[month] = { income: 0, expense: 0 };
            }

            if (amount > 0) {
                analysis.monthlyBreakdown[month].income += amount;
            } else {
                analysis.monthlyBreakdown[month].expense += Math.abs(amount);
            }

            // Simple category detection based on description keywords
            let category = 'Other';
            if (/salary|payroll|income/i.test(description)) {
                category = 'Income';
            } else if (/groceries|supermarket|food/i.test(description)) {
                category = 'Groceries';
            } else if (/restaurant|dining|cafe/i.test(description)) {
                category = 'Dining';
            } else if (/transport|uber|lyft|taxi/i.test(description)) {
                category = 'Transportation';
            } else if (/utilities|electric|water|gas|internet/i.test(description)) {
                category = 'Utilities';
            }

            if (!analysis.categories[category]) {
                analysis.categories[category] = 0;
            }
            analysis.categories[category] += Math.abs(amount);

            // Track large transactions
            analysis.largestTransactions.push({
                date,
                description,
                amount,
                category
            });
        }
    });

    // Sort and limit largest transactions
    analysis.largestTransactions.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));
    analysis.largestTransactions = analysis.largestTransactions.slice(0, 10);

    return analysis;
}
