import React, { useState } from 'react';
import { Upload, message, Input, Form } from 'antd';
import { InboxOutlined, LockOutlined } from '@ant-design/icons';
import type { RcFile, UploadProps } from 'antd/es/upload/interface';
import "./bank-statement-analysis.css";

const { Dragger } = Upload;

interface FileUploadProps {
    onFileUploaded: (response: any) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUploaded }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [showPasswordInput, setShowPasswordInput] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<RcFile | null>(null);

    const handleUpload = async () => {
        if (!selectedFile) {
            message.error('Please select a file first!');
            return;
        }

        setLoading(true);

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

            message.success(`${selectedFile.name} uploaded successfully.`);
            onFileUploaded(result);

            // Reset form
            setSelectedFile(null);
            setPassword('');
            setShowPasswordInput(false);
        } catch (error) {
            message.error(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    const uploadProps: UploadProps = {
        name: 'file',
        multiple: false,
        beforeUpload: (file: RcFile) => {
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
        },
        showUploadList: true,
        maxCount: 1,
    };

    return (
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
                                    style={{marginRight: '8px'}}
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
                                    No, Upload Now
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
                                    {loading ? 'Uploading...' : 'Upload'}
                                </button>
                            </Form.Item>
                        </Form>
                    )}
                </div>
            )}
        </div>
    );
};

export default FileUpload;
