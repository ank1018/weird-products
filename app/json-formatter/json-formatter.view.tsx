"use client";
import React, { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import {
  Copy,
  Check,
  RefreshCw,
  Trash2,
  Download,
  Upload,
  Zap,
  // Search,
  // Sun,
  // Moon,
  // FileText,
  // Code2,
  // Diff,
  // Schema,
} from "lucide-react";
import NavBarView from "../nav-bar/nav-bar.view";
import Footer from "../footer/footer.view";
import "./json-formatter.css";
import dynamic from "next/dynamic";
import { json } from "@codemirror/lang-json";
import { oneDark } from "@codemirror/theme-one-dark";
import { githubLight } from "@uiw/codemirror-theme-github";
import GoogleAd from "../google-ads/google-ads.view";
import JsonFormatterPageDescription from "./json-formatter-description";

// Import the Controlled editor from @uiw/react-codemirror dynamically
const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), {
  ssr: false,
});

// JSON templates
const JSON_TEMPLATES = {
  user: `{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "address": {
      "street": "123 Main St",
      "city": "Anytown",
      "zip": "12345"
    }
  }
}`,
  product: `{
  "product": {
    "id": "P001",
    "name": "Sample Product",
    "price": 99.99,
    "inStock": true,
    "tags": ["electronics", "gadget"],
    "specifications": {
      "color": "black",
      "weight": "1.2kg"
    }
  }
}`,
  apiResponse: `{
  "status": "success",
  "data": {
    "items": [
      {
        "id": 1,
        "name": "Item 1"
      },
      {
        "id": 2,
        "name": "Item 2"
      }
    ],
    "total": 2
  },
  "message": "Operation successful"
}`
};

export default function JsonFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [outputFormat, setOutputFormat] = useState("json");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [jsonPath, setJsonPath] = useState("");
  const [jsonPathResult, setJsonPathResult] = useState("");
  const [diffInput1, setDiffInput1] = useState("");
  const [diffInput2, setDiffInput2] = useState("");
  const [diffResult, setDiffResult] = useState("");
  const [schema, setSchema] = useState("");
  const [schemaValidationResult, setSchemaValidationResult] = useState("");

  useEffect(() => {
    document.body.classList.add("jsonformatter-route-body");
    return () => {
      document.body.classList.remove("jsonformatter-route-body");
    };
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            formatJSON();
            break;
          case 'd':
            e.preventDefault();
            clearAll();
            break;
          case 'c':
            if (!e.shiftKey) return;
            e.preventDefault();
            copyToClipboard(output);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [output]);

  // Auto-format on paste
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const pastedText = e.clipboardData.getData('text');
    try {
      const parsed = JSON.parse(pastedText);
      setInput(JSON.stringify(parsed, null, 2));
      e.preventDefault();
    } catch {
      // If not valid JSON, let the default paste behavior occur
    }
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
        case "minified":
          formatted = JSON.stringify(parsed);
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
      setError(`Invalid JSON: ${(err as Error).message}`);
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
      setError(`Couldn't fix JSON: ${(err as Error).message}`);
      setLoading(false);
    }
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
    setJsonPath("");
    setJsonPathResult("");
    setDiffInput1("");
    setDiffInput2("");
    setDiffResult("");
    setSchema("");
    setSchemaValidationResult("");
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
  const loadTemplate = (templateKey: keyof typeof JSON_TEMPLATES) => {
    setInput(JSON_TEMPLATES[templateKey]);
  };

  const findJsonPath = () => {
    try {
      const parsed = JSON.parse(input);
      const result = jsonPath.split('.').reduce((obj, key) => obj?.[key], parsed);
      setJsonPathResult(JSON.stringify(result, null, 2));
    } catch (err) {
      setJsonPathResult(`Error: ${(err as Error).message}`);
    }
  };

  const compareJson = () => {
    try {
      const obj1 = JSON.parse(diffInput1);
      const obj2 = JSON.parse(diffInput2);
      const differences = findDifferences(obj1, obj2);
      setDiffResult(JSON.stringify(differences, null, 2));
    } catch (err) {
      setDiffResult(`Error: ${(err as Error).message}`);
    }
  };

  const validateSchema = () => {
    try {
      const data = JSON.parse(input);
      const jsonSchema = JSON.parse(schema);
      const result = validateAgainstSchema(data, jsonSchema);
      setSchemaValidationResult(result);
    } catch (err) {
      setSchemaValidationResult(`Error: ${(err as Error).message}`);
    }
  };

  // Helper functions
  const findDifferences = (obj1: any, obj2: any, path = '') => {
    const differences: any = {};
    
    const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
    
    for (const key of allKeys) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (!(key in obj1)) {
        differences[currentPath] = { added: obj2[key] };
      } else if (!(key in obj2)) {
        differences[currentPath] = { removed: obj1[key] };
      } else if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
        const nestedDiff = findDifferences(obj1[key], obj2[key], currentPath);
        if (Object.keys(nestedDiff).length > 0) {
          differences[currentPath] = nestedDiff;
        }
      } else if (obj1[key] !== obj2[key]) {
        differences[currentPath] = {
          old: obj1[key],
          new: obj2[key]
        };
      }
    }
    
    return differences;
  };

  const validateAgainstSchema = (data: any, schema: any) => {
    const errors: string[] = [];
    
    const validateType = (value: any, type: string) => {
      switch (type) {
        case 'string': return typeof value === 'string';
        case 'number': return typeof value === 'number';
        case 'boolean': return typeof value === 'boolean';
        case 'object': return typeof value === 'object' && value !== null;
        case 'array': return Array.isArray(value);
        default: return true;
      }
    };
    
    const validate = (data: any, schema: any, path = '') => {
      if (schema.type && !validateType(data, schema.type)) {
        errors.push(`Type mismatch at ${path}: expected ${schema.type}`);
      }
      
      if (schema.properties && typeof data === 'object') {
        for (const [key, propSchema] of Object.entries(schema.properties)) {
          const currentPath = path ? `${path}.${key}` : key;
          if (key in data) {
            validate(data[key], propSchema as any, currentPath);
          } else if (schema.required?.includes(key)) {
            errors.push(`Missing required field: ${currentPath}`);
          }
        }
      }
    };
    
    validate(data, schema);
    return errors.length === 0 ? 'Valid according to schema' : errors.join('\n');
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
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files && files[0]) {
                            const file = files[0];
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setInput(event.target?.result as string);
                            };
                            reader.readAsText(file);
                          }
                        }}
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
                  theme={theme === 'dark' ? oneDark : githubLight}
                  extensions={[json()]}
                  onChange={(value) => setInput(value)}
                  onPaste={handlePaste}
                  className="json-editor"
                  basicSetup={{
                    lineNumbers: showLineNumbers,
                    highlightActiveLine: true,
                    foldGutter: true,
                  }}
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
                      <option value="minified">Minified JSON</option>
                      <option value="xml">XML</option>
                      <option value="yaml">YAML</option>
                      <option value="csv">CSV</option>
                    </select>
                  </div>

                  <button
                    className="action-btn format-btn"
                    onClick={formatJSON}
                    disabled={loading}
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
                    theme={theme === 'dark' ? oneDark : githubLight}
                    extensions={[json()]}
                    onChange={(value) => setInput(value)}
                    className="json-editor"
                    basicSetup={{
                      lineNumbers: showLineNumbers,
                      highlightActiveLine: true,
                      foldGutter: true,
                    }}
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
