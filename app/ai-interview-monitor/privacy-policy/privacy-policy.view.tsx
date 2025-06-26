import React from 'react';
import './privacy-policy.css';

const PrivacyPolicyView: React.FC = () => {
    return (
        <div className="privacy-policy-container">
            <div className="header">
                <h1>Privacy Policy</h1>
                <p><strong>AI Interview Monitor Extension</strong></p>
                <p>Last updated: June 2025</p>
            </div>

            <div className="section">
                <h2>1. Introduction</h2>
                <p>This Privacy Policy explains how the AI Interview Monitor Chrome extension ("we", "our", or "us") collects,
                    uses, and protects your information when you use our extension.</p>

                <div className="highlight">
                    <strong>Important:</strong> This extension is designed for interview monitoring with explicit user consent.
                    We are committed to protecting your privacy and ensuring transparency in data collection.
                </div>
            </div>

            <div className="section">
                <h2>2. Information We Collect</h2>
                <h3>2.1 Information You Provide</h3>
                <ul>
                    <li><strong>Account Information:</strong> Email address and password for interviewer accounts</li>
                    <li><strong>Session Data:</strong> Interview session logs, timestamps, and candidate interactions</li>
                    <li><strong>Usage Data:</strong> Extension usage patterns and feature interactions</li>
                </ul>

                <h3>2.2 Automatically Collected Information</h3>
                <ul>
                    <li><strong>Technical Data:</strong> Browser type, extension version, and system information</li>
                    <li><strong>Session Logs:</strong> User interactions during monitored interview sessions</li>
                    <li><strong>Performance Data:</strong> Extension performance and error logs</li>
                </ul>
            </div>

            <div className="section">
                <h2>3. How We Use Your Information</h2>
                <p>We use the collected information for:</p>
                <ul>
                    <li>Providing and maintaining the interview monitoring service</li>
                    <li>Authenticating users and managing accounts</li>
                    <li>Storing and retrieving interview session data</li>
                    <li>Improving extension functionality and user experience</li>
                    <li>Providing customer support and technical assistance</li>
                </ul>
            </div>

            <div className="section">
                <h2>4. Data Storage and Security</h2>
                <h3>4.1 Data Storage</h3>
                <ul>
                    <li>User accounts and session data are stored securely in MongoDB</li>
                    <li>Local storage is used for authentication tokens and user preferences</li>
                    <li>Data is encrypted in transit using HTTPS</li>
                </ul>

                <h3>4.2 Security Measures</h3>
                <ul>
                    <li>JWT-based authentication with secure token management</li>
                    <li>Password hashing and secure credential storage</li>
                    <li>Regular security updates and vulnerability assessments</li>
                    <li>Access controls and authentication requirements</li>
                </ul>
            </div>

            <div className="section">
                <h2>5. Data Sharing and Disclosure</h2>
                <p>We do not sell, trade, or otherwise transfer your personal information to third parties, except:</p>
                <ul>
                    <li>With your explicit consent</li>
                    <li>To comply with legal obligations</li>
                    <li>To protect our rights and prevent fraud</li>
                    <li>To service providers who assist in operating our service (under strict confidentiality agreements)</li>
                </ul>
            </div>

            <div className="section">
                <h2>6. User Rights and Choices</h2>
                <h3>6.1 Your Rights</h3>
                <ul>
                    <li><strong>Access:</strong> Request access to your personal data</li>
                    <li><strong>Correction:</strong> Request correction of inaccurate data</li>
                    <li><strong>Deletion:</strong> Request deletion of your data</li>
                    <li><strong>Portability:</strong> Request data in a portable format</li>
                    <li><strong>Objection:</strong> Object to data processing</li>
                </ul>

                <h3>6.2 Consent and Control</h3>
                <ul>
                    <li>You can withdraw consent for data collection at any time</li>
                    <li>You can disable the extension to stop data collection</li>
                    <li>You can delete your account and associated data</li>
                </ul>
            </div>

            <div className="section">
                <h2>7. Data Retention</h2>
                <ul>
                    <li>Account data is retained until account deletion</li>
                    <li>Session logs are retained for 30 days by default</li>
                    <li>You can configure retention periods in your account settings</li>
                    <li>Data is automatically deleted after retention periods expire</li>
                </ul>
            </div>

            <div className="section">
                <h2>8. Session Duration and Monitoring Periods</h2>
                <h3>8.1 Interview Session Duration</h3>
                <ul>
                    <li><strong>Session Length:</strong> Interview monitoring sessions are typically configured for 30-120
                        minutes</li>
                    <li><strong>Automatic Expiry:</strong> Sessions automatically expire after the configured duration</li>
                    <li><strong>Monitoring Cessation:</strong> Data collection stops immediately when the session expires</li>
                    <li><strong>Session Extension:</strong> Sessions cannot be extended beyond the original duration</li>
                </ul>

                <h3>8.2 Monitoring Scope</h3>
                <ul>
                    <li><strong>Active Monitoring:</strong> Data collection only occurs during active interview sessions</li>
                    <li><strong>Consent Required:</strong> Monitoring only starts after explicit user consent</li>
                    <li><strong>Immediate Stop:</strong> Users can stop monitoring at any time during the session</li>
                    <li><strong>Post-Session:</strong> No data is collected after the session expires or is stopped</li>
                </ul>

                <h3>8.3 Session Management</h3>
                <ul>
                    <li><strong>Session Creation:</strong> Sessions are created by interviewers with specific duration settings
                    </li>
                    <li><strong>Duration Notification:</strong> Users are informed of session duration before consent</li>
                    <li><strong>Expiry Warnings:</strong> Users receive warnings when sessions are about to expire</li>
                    <li><strong>Session History:</strong> Completed sessions are retained according to data retention policies
                    </li>
                </ul>
            </div>

            <div className="section">
                <h2>9. Children's Privacy</h2>
                <p>This extension is not intended for use by children under 13 years of age. We do not knowingly collect
                    personal information from children under 13. If you are a parent or guardian and believe your child has
                    provided us with personal information, please contact us immediately.</p>
            </div>

            <div className="section">
                <h2>10. International Data Transfers</h2>
                <p>Your data may be transferred to and processed in countries other than your own. We ensure appropriate
                    safeguards are in place to protect your data in accordance with this Privacy Policy.</p>
            </div>

            <div className="section">
                <h2>11. Changes to This Privacy Policy</h2>
                <p>We may update this Privacy Policy from time to time. We will notify you of any changes by:</p>
                <ul>
                    <li>Posting the new Privacy Policy in the extension</li>
                    <li>Sending you an email notification</li>
                    <li>Updating the "Last updated" date</li>
                </ul>
                <p>Your continued use of the extension after changes constitutes acceptance of the updated policy.</p>
            </div>

            <div className="contact">
                <h2>12. Contact Information</h2>
                <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
                <ul>
                    <li><strong>Email:</strong> aiinterviewmonitor@gmail.com</li>
                </ul>
                <p>We will respond to your inquiry within 30 days.</p>
            </div>

            <div className="section">
                <h2>13. Legal Basis for Processing (GDPR)</h2>
                <p>For users in the European Union, our legal basis for processing personal data includes:</p>
                <ul>
                    <li><strong>Consent:</strong> When you explicitly agree to data processing</li>
                    <li><strong>Contract:</strong> To provide the requested services</li>
                    <li><strong>Legitimate Interest:</strong> To improve our services and prevent fraud</li>
                </ul>
            </div>
        </div>
    );
};

export default PrivacyPolicyView; 