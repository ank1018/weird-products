import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
// import { promises as fs } from "fs";
// import path from "path";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => null); // Catch JSON parsing errors
        if (!body) {
            return NextResponse.json({ error: "Invalid JSON in request" }, { status: 400 });
        }

        const { productName, voteType } = body;
        if (!productName || !["weird", "useful"].includes(voteType)) {
            return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
        }

        // Google Sheets Authentication (Ensure valid JSON key file exists)
        // const credentialsPath = path.join(process.cwd(), "google-service-account.json");
        let credentials;
        try {
            console.log("GOOGLE_SERVICE_ACCOUNT:................", process.env.GOOGLE_SERVICE_ACCOUNT?.slice(0, 50)); // Print first 50 chars to check
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
            // credentials = JSON.parse(await fs.readFile(credentialsPath, "utf-8"));
        } catch (err) {
            console.error("Error reading credentials:", err);
            return NextResponse.json({ error: "Invalid Google API credentials" }, { status: 500 });
        }

        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });

        const sheets = google.sheets({ version: "v4", auth });

        const SHEET_ID = "1bARLD2zaOLKMvfc9w_Bf6asptsjXo5-4e3IuTBjPWTQ";
        const SHEET_NAME = "Sheet1";

        // Fetch existing data
        const { data } = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: SHEET_NAME,
        });

        if (!data.values) {
            return NextResponse.json({ error: "Failed to fetch sheet data" }, { status: 500 });
        }

        const headers = data.values[0];
        const productIndex = data.values.findIndex(row => row[0] === productName);

        if (productIndex === -1) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        const weirdIndex = headers.indexOf("weird");
        const usefulIndex = headers.indexOf("useful");
        if (weirdIndex === -1 || usefulIndex === -1) {
            return NextResponse.json({ error: "Invalid sheet structure" }, { status: 500 });
        }

        const currentValue = parseInt(data.values[productIndex][voteType === "weird" ? weirdIndex : usefulIndex] || "0", 10);
        const newValue = currentValue + 1;

        // Update Google Sheets
        await sheets.spreadsheets.values.update({
            spreadsheetId: SHEET_ID,
            range: `${SHEET_NAME}!${String.fromCharCode(65 + (voteType === "weird" ? weirdIndex : usefulIndex))}${productIndex + 1}`,
            valueInputOption: "USER_ENTERED",
            requestBody: { values: [[newValue]] },
        });

        return NextResponse.json({ success: true, newValue });

    } catch (error) {
        console.error("Error updating vote:", error);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
