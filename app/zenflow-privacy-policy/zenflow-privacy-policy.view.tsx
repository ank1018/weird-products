import React from "react";
import "./zenflow-privacy-policy.css";

const ZenFlowPrivacyPolicyView: React.FC = () => {
  return (
    <div className="zenflow-terms-container">
      <div className="header">
        <h1>Privacy Policy for ZenFlow</h1>
        <p>
          <strong>Last updated:</strong> August 24, 2024
        </p>
      </div>

      <div className="section">
        <h2>Introduction</h2>
        <p>
          ZenFlow (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is
          committed to protecting your privacy. This Privacy Policy explains how
          we collect, use, and safeguard your information when you use our
          mobile application ZenFlow (the &ldquo;App&rdquo;).
        </p>
      </div>

      <div className="section">
        <h2>Information We Collect</h2>
        <h3>Personal Information</h3>
        <p>
          ZenFlow is designed with privacy in mind. We do not collect, store, or
          transmit any personal information to external servers. All your data
          remains on your device.
        </p>

        <h3>App Usage Data</h3>
        <p>The App may request access to:</p>
        <ul>
          <li>
            <strong>App Usage Statistics:</strong> To track your screen time and
            app usage patterns
          </li>
          <li>
            <strong>Calendar Access:</strong> To sync your Google Calendar
            events with the App&apos;s task management features
          </li>
          <li>
            <strong>Notification Permissions:</strong> To send you task
            reminders and wellness notifications
          </li>
        </ul>

        <h3>Data Storage</h3>
        <p>
          All data collected by ZenFlow is stored locally on your device using:
        </p>
        <ul>
          <li>
            <strong>AsyncStorage:</strong> For app settings and user preferences
          </li>
          <li>
            <strong>Local Database:</strong> For tasks, usage statistics, and
            wellness data
          </li>
          <li>
            <strong>Device Storage:</strong> For app cache and temporary files
          </li>
        </ul>
      </div>

      <div className="section">
        <h2>How We Use Your Information</h2>
        <h3>Local Data Processing</h3>
        <p>We use your information locally on your device to:</p>
        <ul>
          <li>Track and analyze your digital wellness patterns</li>
          <li>Manage your tasks and calendar events</li>
          <li>Provide personalized insights and recommendations</li>
          <li>Calculate wellness streaks and achievements</li>
          <li>Send local notifications for task reminders</li>
        </ul>

        <h3>No External Transmission</h3>
        <p>We do not:</p>
        <ul>
          <li>Send your data to external servers</li>
          <li>Share your information with third parties</li>
          <li>Use your data for advertising purposes</li>
          <li>Track your behavior across other apps or websites</li>
        </ul>
      </div>

      <div className="section">
        <h2>Data Security</h2>
        <h3>Local Storage</h3>
        <p>Your data is stored securely on your device using:</p>
        <ul>
          <li>Encrypted local storage</li>
          <li>Secure permission handling</li>
          <li>No cloud synchronization</li>
        </ul>

        <h3>Data Retention</h3>
        <p>Your data remains on your device until you:</p>
        <ul>
          <li>Uninstall the App</li>
          <li>Clear the App&apos;s data through device settings</li>
          <li>Manually delete specific data within the App</li>
        </ul>
      </div>

      <div className="section">
        <h2>Third-Party Services</h2>
        <h3>Google Services</h3>
        <p>The App integrates with Google services for:</p>
        <ul>
          <li>
            <strong>Google Sign-In:</strong> To authenticate with your Google
            account
          </li>
          <li>
            <strong>Google Calendar:</strong> To sync calendar events (optional)
          </li>
          <li>
            <strong>Google Play Services:</strong> For app functionality
          </li>
        </ul>
        <p>
          These integrations are handled through official Google APIs and follow
          Google&apos;s privacy policies.
        </p>

        <h3>No Analytics or Tracking</h3>
        <p>We do not use:</p>
        <ul>
          <li>Google Analytics</li>
          <li>Facebook Pixel</li>
          <li>Any other tracking or analytics services</li>
          <li>Crash reporting services that collect personal data</li>
        </ul>
      </div>

      <div className="section">
        <h2>Your Rights and Choices</h2>
        <h3>Data Control</h3>
        <p>You have complete control over your data:</p>
        <ul>
          <li>
            <strong>Access:</strong> All your data is stored locally and
            accessible through the App
          </li>
          <li>
            <strong>Modification:</strong> You can edit or delete your data at
            any time
          </li>
          <li>
            <strong>Export:</strong> You can export your data through device
            backup features
          </li>
          <li>
            <strong>Deletion:</strong> Uninstalling the App removes all
            associated data
          </li>
        </ul>

        <h3>Permissions</h3>
        <p>You can manage app permissions through your device settings:</p>
        <ul>
          <li>
            <strong>App Usage Access:</strong> Required for screen time tracking
          </li>
          <li>
            <strong>Calendar Access:</strong> Optional for Google Calendar sync
          </li>
          <li>
            <strong>Notifications:</strong> Optional for task reminders
          </li>
        </ul>
      </div>

      <div className="section">
        <h2>Children&apos;s Privacy</h2>
        <p>
          ZenFlow is not intended for children under 13 years of age. We do not
          knowingly collect personal information from children under 13. If you
          are a parent or guardian and believe your child has provided us with
          personal information, please contact us.
        </p>
      </div>

      <div className="section">
        <h2>Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify
          you of any changes by:
        </p>
        <ul>
          <li>Posting the new Privacy Policy in the App</li>
          <li>
            Updating the &ldquo;Last updated&rdquo; date at the top of this
            policy
          </li>
        </ul>
      </div>

      <div className="contact">
        <h2>Contact Information</h2>
        <p>
          If you have any questions about this Privacy Policy or our data
          practices, please contact us at:
        </p>
        <ul>
          <li>
            <strong>Email:</strong> writetoankursingh@gmail.com
          </li>
        </ul>
      </div>

      <div className="section">
        <h2>Legal Basis for Processing (GDPR)</h2>
        <p>
          If you are in the European Union, our legal basis for processing your
          data is:
        </p>
        <ul>
          <li>
            <strong>Consent:</strong> You provide explicit consent when granting
            app permissions
          </li>
          <li>
            <strong>Legitimate Interest:</strong> To provide you with the
            App&apos;s core functionality
          </li>
          <li>
            <strong>Contract:</strong> To fulfill our obligations under the
            App&apos;s terms of service
          </li>
        </ul>
      </div>

      <div className="section">
        <h2>California Privacy Rights (CCPA)</h2>
        <p>If you are a California resident, you have the right to:</p>
        <ul>
          <li>Know what personal information is collected</li>
          <li>Know whether personal information is sold or disclosed</li>
          <li>Say no to the sale of personal information</li>
          <li>Access your personal information</li>
          <li>Equal service and price</li>
        </ul>
        <p>
          Since we do not collect, sell, or share personal information, these
          rights are automatically satisfied.
        </p>
      </div>

      <div className="section">
        <h2>International Data Transfers</h2>
        <p>
          Since all data is stored locally on your device, no international data
          transfers occur.
        </p>
      </div>

      <div className="footer">
        <p>
          <strong>Note:</strong> This privacy policy is effective as of the date
          listed above and applies to all users of the ZenFlow mobile
          application.
        </p>
      </div>
    </div>
  );
};

export default ZenFlowPrivacyPolicyView;
