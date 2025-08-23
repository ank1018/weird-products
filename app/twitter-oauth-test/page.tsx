"use client";

import { useState } from "react";

export default function TwitterOAuthTest() {
  const [testUrl, setTestUrl] = useState("");
  const [result, setResult] = useState("");

  const generateTestUrl = () => {
    const clientId = "WmgwZ2Q5ZFNDdk5RTGNBZnozb2k6MTpjaQ";
    const redirectUri =
      "http://localhost:3000/api/ai-marketing-agent/social-auth/twitter/callback";
    const state = Math.random().toString(36).substring(7);

    const url =
      `https://twitter.com/i/oauth2/authorize?` +
      `response_type=code&` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=tweet.read%20tweet.write%20users.read%20offline.access&` +
      `state=${state}`;

    setTestUrl(url);
    setResult("URL generated. Click 'Test OAuth' to open it.");
  };

  const testOAuth = () => {
    if (testUrl) {
      window.open(testUrl, "_blank", "width=600,height=600");
      setResult("OAuth window opened. Check for any error messages.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Twitter OAuth Test Tool
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Configuration</h2>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Client ID:</strong> WmgwZ2Q5ZFNDdk5RTGNBZnozb2k6MTpjaQ
            </p>
            <p>
              <strong>Redirect URI:</strong>{" "}
              http://localhost:3000/api/ai-marketing-agent/social-auth/twitter/callback
            </p>
            <p>
              <strong>Scopes:</strong> tweet.read tweet.write users.read
              offline.access
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test OAuth Flow</h2>
          <div className="space-y-4">
            <button
              onClick={generateTestUrl}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Generate OAuth URL
            </button>

            {testUrl && (
              <button
                onClick={testOAuth}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-2"
              >
                Test OAuth
              </button>
            )}
          </div>

          {result && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-blue-800">{result}</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Troubleshooting</h2>
          <div className="space-y-2 text-sm">
            <p>
              <strong>
                If you see "You weren't able to give access to the App":
              </strong>
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Check that your Twitter app has OAuth 2.0 enabled</li>
              <li>Verify the callback URL matches exactly</li>
              <li>Ensure app permissions are set to "Read and Write"</li>
              <li>
                Check that your app is approved for the requested permissions
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
