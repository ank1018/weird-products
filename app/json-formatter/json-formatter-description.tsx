import "./json-formatter.css";

export default function JsonFormatterPageDescription() {
  return (
    <>
      {/* JSON Specification */}
      <div className="info-section">
        <h3>JSON Specification</h3>
        <div className="ip-table-wrapper">
          <table className="ip-table">
            <thead>
              <tr>
                <th>Element</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Objects</td>
                <td>
                  Enclosed in curly braces <code>{`{}`}</code> and contain
                  name/value pairs
                </td>
              </tr>
              <tr>
                <td>Arrays</td>
                <td>
                  Enclosed in square brackets <code>[]</code> and contain a list
                  of values
                </td>
              </tr>
              <tr>
                <td>Strings</td>
                <td>
                  Must be written with double quotes <code>&quot; &quot;</code>
                </td>
              </tr>
              <tr>
                <td>Numbers</td>
                <td>Can be integers or floating point numbers</td>
              </tr>
              <tr>
                <td>Boolean</td>
                <td>
                  Can be <code>true</code> or <code>false</code> (lowercase)
                </td>
              </tr>
              <tr>
                <td>null</td>
                <td>
                  Represents a <code>null</code> value
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="ip-note">
          <p>
            JSON (JavaScript Object Notation) is a lightweight data-interchange
            format that is easy for humans to read and write and easy for
            machines to parse and generate. It is widely used for data
            serialization, configuration files, and exchanging data between
            servers and client applications.
          </p>
        </div>
      </div>

      {/* Additional Info & FAQs for SEO below */}
      <div className="info-section">
        <h3>What is JSON?</h3>
        <p>
          JSON stands for <strong>JavaScript Object Notation</strong>. Despite
          its name, JSON is language-independent and can be used in nearly any
          programming environment. It represents data in a simple, structured
          way using key-value pairs (objects) and lists (arrays). JSON’s
          human-readable format and easy parsing capabilities have made it a de
          facto standard for RESTful APIs, configuration files, and more.
        </p>

        <h3>Why Use a JSON Formatter?</h3>
        <ul>
          <li>
            <strong>Readability:</strong> A formatter organizes your JSON into a
            clean, indented structure, making it easier to read and debug.
          </li>
          <li>
            <strong>Validation:</strong> By formatting, you often catch errors
            (like missing commas or mismatched braces) quickly.
          </li>
          <li>
            <strong>Consistency:</strong> Team members and automated systems can
            rely on consistently formatted JSON to reduce merge conflicts and
            confusion.
          </li>
        </ul>

        <h3>What is XML?</h3>
        <p>
          <strong>XML (Extensible Markup Language)</strong> is a markup language
          designed to store and transport data. It uses tags to define elements,
          similar to HTML. XML is still used in certain enterprise systems,
          configuration files, and feeds (e.g., RSS feeds). Converting between
          JSON and XML can be useful for systems that expect a particular
          format.
        </p>

        <h3>What is YAML?</h3>
        <p>
          <strong>YAML</strong> (YAML Ain’t Markup Language) is a data
          serialization language often used for configuration files because of
          its human-friendly syntax. It relies on indentation to represent
          structure, which makes it very readable but can sometimes lead to
          indentation errors. JSON to YAML conversion is common for developers
          needing simpler syntax in config files.
        </p>

        <h3>What is CSV?</h3>
        <p>
          <strong>CSV (Comma-Separated Values)</strong> is a plain-text format
          used to represent tabular data. Each line typically represents a row,
          with columns separated by commas (or another delimiter). Converting
          JSON to CSV is helpful when you want to analyze data in spreadsheet
          software or import it into SQL databases.
        </p>

        <h3>Frequently Asked Questions (FAQ)</h3>
        <div className="ip-note">
          <p>
            <strong>Q:</strong> How do I validate my JSON?
          </p>
          <p>
            <strong>A:</strong> Use our JSON formatter tool or any JSON
            validator to check for syntax errors. If you see error messages
            about “Unexpected token” or “Unexpected end of JSON,” check for
            trailing commas, missing braces, or unquoted keys.
          </p>
          <br />

          <p>
            <strong>Q:</strong> Can I convert JSON to XML, YAML, or CSV?
          </p>
          <p>
            <strong>A:</strong> Yes. Our tool can convert JSON data into various
            formats, including XML, YAML, and CSV. Simply select your desired
            output format and click “Convert &amp; Format.”
          </p>
          <br />

          <p>
            <strong>Q:</strong> Is there a file size limit for JSON formatting?
          </p>
          <p>
            <strong>A:</strong> In most browsers, very large JSON files might
            cause performance issues, but generally our tool can handle typical
            JSON files. For extremely large files, consider using command-line
            tools or specialized editors.
          </p>
          <br />

          <p>
            <strong>Q:</strong> How do I fix common JSON errors?
          </p>
          <p>
            <strong>A:</strong> Common JSON errors include missing quotes,
            trailing commas, or improper bracket matching. Use our “Fix JSON”
            feature to attempt an automatic correction, or manually check your
            data for these mistakes.
          </p>
          <br />

          <p>
            <strong>Q:</strong> Is JSON more secure than XML?
          </p>
          <p>
            <strong>A:</strong> JSON and XML both can be secure or insecure
            depending on how you parse and handle data. Always sanitize and
            validate any external input to prevent security vulnerabilities such
            as injection attacks.
          </p>
        </div>

        <h3>Performance & Best Practices</h3>
        <ul>
          <li>
            <strong>Minification:</strong> For production, minifying JSON can
            reduce file size. However, for debugging or collaboration, formatted
            JSON is more readable.
          </li>
          <li>
            <strong>Schema Validation:</strong> Use JSON Schema to enforce data
            structure. This ensures incoming JSON data meets your requirements,
            preventing errors downstream.
          </li>
          <li>
            <strong>Caching:</strong> When dealing with large or frequently
            requested JSON responses, consider caching (e.g., using a CDN) to
            improve performance.
          </li>
        </ul>

        <h3>Conclusion</h3>
        <p>
          Whether you’re a developer, data analyst, or just getting started,
          having a reliable JSON formatter and converter can save you time and
          headaches. From formatting and fixing JSON to converting between XML,
          YAML, and CSV, our tool is designed to streamline your workflow.
          Properly formatted and validated JSON reduces errors, improves
          readability, and ensures data integrity across different applications.
        </p>
      </div>
    </>
  );
}
