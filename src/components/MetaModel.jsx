import React, { useState } from "react";
import "../css/metamodel.css"; // Import the CSS file

const initialMetamodels = {
  Underwriting: "metamodel code...",
  Claims: "metamodel code...",
  Actuarial: "metamodel code...",
  "Sales & Marketing": "metamodel code...",
  "Customer Service": "metamodel code...",
  "Policy Administration": "metamodel code...",
  "Finance & Accounting": "metamodel code...",
  "Legal & Compliance": "metamodel code...",
  "Information Technology": "metamodel code...",
  "Human Resources": "metamodel code...",
  "Risk Management": "metamodel code...",
  Reinsurance: "metamodel code...",
  "Product Development": "metamodel code...",
  // Add other departments here
};

function CodeEditor() {
  const [selectedDept, setSelectedDept] = useState("Finance");
  const [metamodels, setMetamodels] = useState(initialMetamodels);
  const [code, setCode] = useState(initialMetamodels["Finance"]);
  const [uploading, setUploading] = useState(false);
  const [jsonError, setJsonError] = useState(null); // Track JSON error message

  const handleDeptChange = (e) => {
    const dept = e.target.value;
    setSelectedDept(dept);
    setCode(metamodels[dept]);
    setJsonError(null); // Reset error on department change
  };

  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);
    validateJson(newCode); // Validate JSON on code change
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newMetamodel = event.target.result;
        setMetamodels((prev) => ({
          ...prev,
          [selectedDept]: newMetamodel,
        }));
        setCode(newMetamodel);
        validateJson(newMetamodel); // Validate JSON on file select
      };
      reader.readAsText(file);
    }
  };

  const validateJson = (text) => {
    try {
      JSON.parse(text); // Attempt to parse JSON
      setJsonError(null); // Clear any previous error if valid
    } catch (error) {
      const errorMessage = error.message;
      const errorLine = findErrorLine(text, errorMessage);
      setJsonError(`JSON Error: ${errorMessage}`);
    }
  };

  const findErrorLine = (text, errorMessage) => {
    const lines = text.split("\n");
    const regex = /position (\d+)/; // Extract error position from message
    const match = errorMessage.match(regex);
    if (match) {
      const errorPosition = parseInt(match[1], 10);
      let charCount = 0;
      for (let i = 0; i < lines.length; i++) {
        charCount += lines[i].length + 1; // Count line chars (+1 for newline)
        if (charCount >= errorPosition) {
          return i + 1; // Return line number
        }
      }
    }
    return "unknown";
  };

  const handleUploadToBackend = async () => {
    // Check if JSON is valid before uploading
    if (jsonError) {
      alert("Cannot upload. Fix JSON syntax errors first.");
      return;
    }

    setUploading(true); // Show loading state
    try {
      const response = await fetch("", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          department: selectedDept,
          metamodel: code,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to upload metamodel");
      }

      alert("Metamodel uploaded successfully!");
    } catch (error) {
      console.error("Error uploading metamodel:", error);
      alert("Error uploading metamodel.");
    } finally {
      setUploading(false); // Reset loading state
    }
  };

  return (
    <div className="container">
      <h1>Department Metamodel Editor</h1>

      <label htmlFor="department" className="label">
        Select Department:
      </label>
      <select
        id="department"
        className="dropdown"
        value={selectedDept}
        onChange={handleDeptChange}
      >
        {Object.keys(metamodels).map((dept) => (
          <option key={dept} value={dept}>
            {dept}
          </option>
        ))}
      </select>

      <textarea
        className="code-editor"
        value={code}
        onChange={handleCodeChange}
      />

      {jsonError && <div className="error-message">{jsonError}</div>}

      <div className="select-section">
        <label htmlFor="fileSelect" className="label">
          Select Metamodel:
        </label>
        <label htmlFor="fileSelect" className="custom-file-label">
          Choose File
        </label>
        <input
          type="file"
          id="fileSelect"
          accept=".txt"
          onChange={handleFileSelect}
        />
      </div>

      <button
        className="upload-button"
        onClick={handleUploadToBackend}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload Metamodel"}
      </button>
    </div>
  );
}

export default CodeEditor;
