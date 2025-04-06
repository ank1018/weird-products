// pages/index.js
"use client";
import React, { useState } from 'react';
import Head from 'next/head';
import FileUpload from "./file-upload";
import AnalysisResults from "./analysis-results";
import "./bank-statement-analysis.css"
import BankStatementAnalyzer from "./bank-statement-analyzer/bank-statement-analyzer.view";

interface AnalysisResult {
    status: 'processing' | 'complete' | 'password_required';
    fileId?: string;
    analysis?: any;
    error?: string;
}

export default function BankStatementAnalysisView() {
    const [analysis, setAnalysis] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [passwordModal, setPasswordModal] = useState(false);
    const [password, setPassword] = useState('');
    const [currentFile, setCurrentFile] = useState<string | null>(null);

    const handleFileUploaded = (result: AnalysisResult) => {
        if (result.status === 'processing') {
            setLoading(true);
            // Poll for results
            checkAnalysisStatus(result.fileId!);
        } else if (result.status === 'complete') {
            setLoading(false);
            setAnalysis(result.analysis);
        } else if (result.status === 'password_required') {
            setCurrentFile(result.fileId!);
            setPasswordModal(true);
        }
    };

    const checkAnalysisStatus = async (fileId: string) => {
        try {
            const response = await fetch(`/api/status?fileId=${fileId}`);
            const result: AnalysisResult = await response.json();

            if (result.status === 'complete') {
                setLoading(false);
                setAnalysis(result.analysis);
            } else if (result.status === 'processing') {
                // Keep polling
                setTimeout(() => checkAnalysisStatus(fileId), 2000);
            } else if (result.status === 'password_required') {
                setLoading(false);
                setCurrentFile(fileId);
                setPasswordModal(true);
            } else {
                setLoading(false);
                alert('Error processing file: ' + (result.error || 'Unknown error'));
            }
        } catch (error) {
            setLoading(false);
            console.error('Error checking status:', error);
            alert('Error checking status');
        }
    };

    const handlePasswordSubmit = async () => {
        setLoading(true);
        setPasswordModal(false);

        try {
            const response = await fetch('/api/process-with-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fileId: currentFile,
                    password: password
                }),
            });

            const result = await response.json();

            if (result.status === 'processing') {
                // Poll for results
                checkAnalysisStatus(result.fileId!);
            } else if (result.status === 'complete') {
                setLoading(false);
                setAnalysis(result.analysis);
            } else {
                setLoading(false);
                alert('Error processing file: ' + (result.error || 'Unknown error'));
            }
        } catch (error) {
            setLoading(false);
            console.error('Error submitting password:', error);
            alert('Error submitting password');
        }
    };

    return (
        <div className="container">
            <Head>
                <title>Bank Statement Analyzer</title>
                <meta name="description" content="Analyze your bank statements easily" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="container">
                <h1 className="container">
                    Bank Statement Analyzer
                </h1>

                <p className="description">
                    Upload your bank statement to get insights
                </p>

                <BankStatementAnalyzer />
            </main>
        </div>
    );
}
