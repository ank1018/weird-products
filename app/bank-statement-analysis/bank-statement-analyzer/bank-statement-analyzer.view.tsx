import React, { useState } from 'react';
import { Upload, message, Input, Form, Spin, Result } from 'antd';
import { InboxOutlined, LockOutlined } from '@ant-design/icons';
import "./bank-statement-analyzer.css";
import BankStatementDashboard from "../bank-statement-dashboard/bank-statement-dashboard.view";

const { Dragger } = Upload;

const BankStatementAnalyzer = () => {
    const [loading, setLoading] = useState(false);
    const [showPasswordInput, setShowPasswordInput] = useState(false);
    const [password, setPassword] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [analysisData, setAnalysisData] = useState(null);
    const [error, setError] = useState(null);

    const handleUpload = async () => {
        if (!selectedFile) {
            message.error('Please select a file first!');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            if (password) {
                formData.append('password', password);
            }

            const response = await fetch('/api/uploadFile', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to upload file');
            }

            message.success(`${selectedFile.name} analyzed successfully.`);
            setAnalysisData(result);

            // Keep the file selected but clear password
            setPassword('');
            setShowPasswordInput(false);
        } catch (error) {
            setError(error.message || 'An unknown error occurred');
            message.error(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    const uploadProps = {
        name: 'file',
        multiple: false,
        beforeUpload: (file) => {
            const acceptedTypes = ['.pdf', '.csv', '.xls', '.xlsx'];
            const extension = file.name.split('.').pop()?.toLowerCase();
            const fileExtension = extension ? `.${extension}` : '';

            if (!acceptedTypes.includes(fileExtension)) {
                message.error(`${file.name} is not a supported file type.`);
                return Upload.LIST_IGNORE;
            }

            setSelectedFile(file);
            return false; // Prevent automatic upload
        },
        onRemove: () => {
            setSelectedFile(null);
            setShowPasswordInput(false);
            setAnalysisData(null); // Clear previous analysis
        },
        showUploadList: true,
        maxCount: 1,
    };

    const handleReset = () => {
        setSelectedFile(null);
        setPassword('');
        setShowPasswordInput(false);
        setAnalysisData(null);
        setError(null);
    };

    return (
        <div className="bank-statement-analyzer">
            {!analysisData ? (
                <div className="upload-section">
                    <h2>Bank Statement Analysis Tool</h2>
                    <p className="description">
                        Upload your bank statement to analyze your income, expenses, and financial patterns.
                        We support PDF, CSV, XLS, and XLSX formats.
                    </p>

                    <div className="upload-container">
                        <Dragger {...uploadProps} disabled={loading}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag bank statement to upload</p>
                            <p className="ant-upload-hint">
                                Support for PDF, CSV, XLS, XLSX files. Password-protected files are supported.
                            </p>
                        </Dragger>

                        {selectedFile && (
                            <div className="password-section" style={{ marginTop: '16px' }}>
                                {!showPasswordInput ? (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                        <span>Is this file password protected?</span>
                                        <div>
                                            <button
                                                type="button"
                                                onClick={() => setShowPasswordInput(true)}
                                                style={{ marginRight: '8px' }}
                                                className="ant-btn ant-btn-default"
                                            >
                                                Yes
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleUpload}
                                                className="ant-btn ant-btn-primary"
                                                disabled={loading}
                                            >
                                                No, Analyze Now
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <Form layout="vertical">
                                        <Form.Item label="Password">
                                            <Input.Password
                                                placeholder="Enter file password"
                                                prefix={<LockOutlined />}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </Form.Item>
                                        <Form.Item>
                                            <button
                                                type="button"
                                                onClick={handleUpload}
                                                className="ant-btn ant-btn-primary"
                                                disabled={loading}
                                            >
                                                {loading ? 'Analyzing...' : 'Analyze Now'}
                                            </button>
                                        </Form.Item>
                                    </Form>
                                )}
                            </div>
                        )}

                        {loading && (
                            <div className="loading-overlay">
                                <Spin size="large" tip="Analyzing your statement..." />
                            </div>
                        )}

                        {error && (
                            <Result
                                status="error"
                                title="Analysis Failed"
                                subTitle={error}
                                extra={[
                                    <button key="retry" onClick={handleReset} className="ant-btn ant-btn-primary">
                                        Try Again
                                    </button>
                                ]}
                            />
                        )}
                    </div>
                </div>
            ) : (
                <div className="analysis-results">
                    <div className="actions-bar" style={{ marginBottom: '20px' }}>
                        <button
                            onClick={handleReset}
                            className="ant-btn ant-btn-default"
                        >
                            Upload Another Statement
                        </button>
                    </div>

                    <BankStatementDashboard data={analysisData} />
                </div>
            )}
        </div>
    );
};

export default BankStatementAnalyzer;
