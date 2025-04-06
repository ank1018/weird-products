"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import {
  Copy,
  Check,
  RefreshCw,
  Trash2,
  Download,
  Upload,
  Zap,
} from "lucide-react";
import NavBarView from "../nav-bar/nav-bar.view";
import Footer from "../footer/footer.view";
import "./json-formatter.css";
import dynamic from "next/dynamic";
import { json } from "@codemirror/lang-json";
import { oneDark } from "@codemirror/theme-one-dark";
import GoogleAd from "../google-ads/google-ads.view";
import JsonFormatterPageDescription from "./json-formatter-description";

// Import the Controlled editor from @uiw/react-codemirror dynamically
const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), {
  ssr: false,
});

export default function JsonFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [outputFormat, setOutputFormat] = useState("json");

  useEffect(() => {
    document.body.classList.add("jsonformatter-route-body");
    return () => {
      document.body.classList.remove("jsonformatter-route-body");
    };
  }, []);

  // --------------------------
  // JSON Handlers
  // --------------------------
  const formatJSON = () => {
    if (!input.trim()) {
      setOutput("");
      setError("");
      return;
    }

    try {
      setLoading(true);
      const parsed = JSON.parse(input);

      let formatted;
      switch (outputFormat) {
        case "json":
          formatted = JSON.stringify(parsed, null, 2);
          break;
        case "xml":
          formatted = jsonToXml(parsed);
          break;
        case "yaml":
          formatted = jsonToYaml(parsed);
          break;
        case "csv":
          formatted = jsonToCsv(parsed);
          break;
        default:
          formatted = JSON.stringify(parsed, null, 2);
      }

      setOutput(formatted);
      setError("");
      setLoading(false);
    } catch (err) {
      setError(`Invalid JSON: ${err}`);
      setLoading(false);
    }
  };

  const fixJSON = () => {
    if (!input.trim()) return;
    try {
      setLoading(true);
      const fixed = input
        .replace(/'/g, '"')
        .replace(/([{,]\s*)(\w+)\s*:/g, '$1"$2":')
        .replace(/,\s*([}\]])/g, "$1");
      const parsed = JSON.parse(fixed);
      setInput(JSON.stringify(parsed, null, 2));
      setError("");
      setLoading(false);
    } catch (err) {
      setError(`Couldn't fix JSON: ${err}`);
      setLoading(false);
    }
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  // --------------------------
  // Format Conversions
  // --------------------------
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jsonToXml = (obj: any, root = "root") => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<${root}>`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parseObject = (o: any) => {
      for (const key in o) {
        const value = o[key];
        if (Array.isArray(value)) {
          for (const item of value) {
            if (typeof item === "object" && item !== null) {
              xml += `\n  <${key}>`;
              parseObject(item);
              xml += `\n  </${key}>`;
            } else {
              xml += `\n  <${key}>${item}</${key}>`;
            }
          }
        } else if (typeof value === "object" && value !== null) {
          xml += `\n  <${key}>`;
          parseObject(value);
          xml += `\n  </${key}>`;
        } else {
          xml += `\n  <${key}>${value !== null ? value : ""}</${key}>`;
        }
      }
    };

    parseObject(obj);
    xml += `\n</${root}>`;
    return xml;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jsonToYaml = (obj: any, indent = 0) => {
    let yaml = "";
    const spaces = " ".repeat(indent);

    for (const key in obj) {
      const value = obj[key];

      if (Array.isArray(value)) {
        yaml += `${spaces}${key}:\n`;
        for (const item of value) {
          if (typeof item === "object" && item !== null) {
            yaml += `${spaces}- \n${jsonToYaml(item, indent + 2)}`;
          } else {
            yaml += `${spaces}- ${item}\n`;
          }
        }
      } else if (typeof value === "object" && value !== null) {
        yaml += `${spaces}${key}:\n${jsonToYaml(value, indent + 2)}`;
      } else {
        yaml += `${spaces}${key}: ${value !== null ? value : "null"}\n`;
      }
    }
    return yaml;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jsonToCsv = (obj: any) => {
    if (!Array.isArray(obj)) {
      if (typeof obj === "object" && obj !== null) {
        obj = [obj];
      } else {
        return "Cannot convert to CSV. Input must be an array of objects or a single object.";
      }
    }

    if (obj.length === 0) return "";

    const headers = Object.keys(obj[0]);
    let csv = headers.join(",") + "\n";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    obj.forEach((row: any) => {
      const values = headers.map((header) => {
        const value = row[header];
        if (value === null || value === undefined) return "";
        if (typeof value === "object") return JSON.stringify(value);
        return String(value).replace(/"/g, '""');
      });
      csv += values.join(",") + "\n";
    });

    return csv;
  };

  // --------------------------
  // Template & File Handling
  // --------------------------
  //   const loadTemplate = (templateKey: string) => {
  //     setTemplate((prev) => ({
  //       ...prev,
  //       selected: templateKey,
  //     }));
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //     // @ts-expect-error
  //     setInput(template.options[templateKey]);
  //   };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const uploadJSON = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reader.onload = (event: any) => {
      setInput(event.target.result);
    };
    reader.readAsText(file);
    e.target.value = null; // reset
  };

  // --------------------------
  // Copy & Download
  // --------------------------
  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadOutput = () => {
    if (!output) return;
    const fileExtension = getFileExtension();
    const mimeType = getMimeType();

    const blob = new Blob([output], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `converted.${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getFileExtension = () => {
    switch (outputFormat) {
      case "json":
        return "json";
      case "xml":
        return "xml";
      case "yaml":
        return "yaml";
      case "csv":
        return "csv";
      default:
        return "json";
    }
  };

  const getMimeType = () => {
    switch (outputFormat) {
      case "json":
        return "application/json";
      case "xml":
        return "application/xml";
      case "yaml":
        return "text/yaml";
      case "csv":
        return "text/csv";
      default:
        return "application/json";
    }
  };

  // Icon helper
  //   const getFormatIcon = () => {
  //     switch (outputFormat) {
  //       case "json":
  //         return <FileJson size={16} />;
  //       case "xml":
  //         return <FileCode size={16} />;
  //       case "yaml":
  //         return <FileText size={16} />;
  //       case "csv":
  //         return <FileSpreadsheet size={16} />;
  //       default:
  //         return <FileJson size={16} />;
  //     }
  //   };

  return (
    <div className="background">
      <Head>
        <title>
          JSON Formatter & Converter | Format, Validate, Convert JSON Data
        </title>
        <meta
          name="description"
          content="Format, validate, and convert your JSON data with our free online tool. Convert to XML, YAML, CSV and more with side-by-side preview."
        />
        <meta
          name="keywords"
          content="JSON formatter, JSON validator, format JSON, fix JSON, JSON templates, JSON to XML, JSON to YAML, JSON to CSV, online JSON tools"
        />
      </Head>

      <NavBarView />

      <div className="jsonformatter-layout">
        <div className="main-content full-width">
          <div className="jsonformatter-card">
            <h1 className="jsonformatter-title">JSON Formatter & Converter</h1>

            <GoogleAd slot={"2296640639"} className="ad-top" />

            {/* UPDATED LAYOUT BELOW */}
            <div className="editors-container">
              {/* Original JSON Input (Left) */}
              <div className="editor-section">
                <div className="editor-header">
                  <h3>JSON Input</h3>
                  <div className="editor-controls">
                    <label className="action-btn upload-btn">
                      <Upload size={16} /> Import
                      <input
                        type="file"
                        accept=".json,application/json"
                        className="hidden-input"
                        onChange={uploadJSON}
                      />
                    </label>
                    <button className="action-btn clear-btn" onClick={clearAll}>
                      <Trash2 size={16} /> Clear
                    </button>
                  </div>
                </div>
                <CodeMirror
                  value={input}
                  height="750px"
                  maxWidth="100%"
                  theme={oneDark}
                  extensions={[json()]}
                  onChange={(value) => setInput(value)}
                  className="json-editor"
                />
              </div>

              {/* Middle Section with Action Buttons & Error/Loading */}
              <div className="middle-section">
                <div className="json-actions">
                  {/* Format Section */}
                  <div className="format-section">
                    <h3>Output Format</h3>
                    <select
                      className="format-select"
                      value={outputFormat}
                      onChange={(e) => setOutputFormat(e.target.value)}
                    >
                      <option value="json">JSON</option>
                      <option value="xml">XML</option>
                      <option value="yaml">YAML</option>
                      <option value="csv">CSV</option>
                    </select>
                  </div>

                  {/* Format indicator button */}
                  {/* <button className="action-btn format-info-btn">
                    {getFormatIcon()} {outputFormat.toUpperCase()}
                  </button> */}

                  <button
                    className="action-btn format-btn"
                    onClick={formatJSON}
                  >
                    <RefreshCw size={16} /> Convert &amp; Format
                  </button>

                  <button className="action-btn fix-btn" onClick={fixJSON}>
                    <Zap size={16} /> Fix JSON
                  </button>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="jsonformatter-error">
                    <p>{error}</p>
                  </div>
                )}

                {/* Loading Indicator */}
                {loading && (
                  <div className="jsonformatter-loading">
                    <div className="loader"></div>
                    <p>Processing JSON...</p>
                  </div>
                )}
              </div>

              {/* Formatted/Converted Output (Right) */}
              <div className="editor-section">
                <div className="editor-header">
                  <h3>Converted Output</h3>
                  <div className="editor-controls">
                    <button
                      className={`action-btn copy-btn ${
                        copied ? "copied" : ""
                      }`}
                      onClick={() => copyToClipboard(output)}
                      disabled={!output}
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}{" "}
                      {copied ? "Copied!" : "Copy"}
                    </button>
                    <button
                      className="action-btn download-btn"
                      onClick={downloadOutput}
                      disabled={!output}
                    >
                      <Download size={16} /> Download
                    </button>
                  </div>
                </div>
                <div className="json-output">
                  <CodeMirror
                    value={output}
                    height="750px"
                    maxWidth="100%"
                    theme={oneDark}
                    extensions={[json()]}
                    onChange={(value) => setInput(value)}
                    className="json-editor"
                  />
                </div>
              </div>
            </div>
            {/* END UPDATED LAYOUT */}

            <GoogleAd slot={"5420878871"} className="ad-bottom" />

            {/* JSON Specification */}
            <JsonFormatterPageDescription />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
