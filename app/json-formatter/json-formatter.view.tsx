"use client";
import React, { useState } from "react";
import HeaderView from "../header/header.view";
import Footer from "../footer/footer.view";

export default function JsonFormatterPage() {
  const [jsonInput, setJsonInput] = useState("");
  const [formattedJson, setFormattedJson] = useState("");
  const [error, setError] = useState("");
  const [spacing, setSpacing] = useState(2);

  const formatJSON = () => {
    try {
      const parsedJSON = JSON.parse(jsonInput);
      setFormattedJson(JSON.stringify(parsedJSON, null, spacing));
      setError("");
    } catch (err: any) {
      setError("Invalid JSON: " + err.message);
      setFormattedJson("");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formattedJson);
  };

  const clearAll = () => {
    setJsonInput("");
    setFormattedJson("");
    setError("");
  };

  return (
    <div className="background">
      <HeaderView />

      <div className="json-formatter-container">
        <div className="json-formatter-card">
          <h1 className="json-formatter-title">JSON Formatter</h1>

          <div className="json-controls">
            <label className="json-label">
              Indent Spacing:
              <select
                value={spacing}
                onChange={(e) => setSpacing(Number(e.target.value))}
                className="json-select"
              >
                <option value={2}>2 spaces</option>
                <option value={4}>4 spaces</option>
                <option value={8}>8 spaces</option>
              </select>
            </label>

            <div className="json-buttons">
              <button onClick={formatJSON} className="json-button format-btn">
                Format JSON
              </button>
              <button onClick={clearAll} className="json-button clear-btn">
                Clear All
              </button>
              {formattedJson && (
                <button
                  onClick={copyToClipboard}
                  className="json-button copy-btn"
                >
                  Copy
                </button>
              )}
            </div>
          </div>

          <div className="json-input-container">
            <textarea
              className="json-textarea"
              placeholder="Paste your JSON here..."
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              rows={10}
            />
          </div>

          {error && <div className="json-error">{error}</div>}

          {formattedJson && (
            <div className="json-output-container">
              <pre className="json-output">{formattedJson}</pre>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
