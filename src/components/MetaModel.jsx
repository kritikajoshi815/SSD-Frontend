import React, { useState } from "react";
import "../css/metamodel.css"; // Import the CSS file

const initialMetamodels = {
  Finance: "// Finance metamodel code...",
  Marketing: "// Marketing metamodel code...",
  HR: "// HR metamodel code...",
  // Add other departments here
};

function CodeEditor() {
  const [selectedDept, setSelectedDept] = useState("Finance");
  const [metamodels, setMetamodels] = useState(initialMetamodels);
  const [code, setCode] = useState(initialMetamodels["Finance"]);
  const [uploading, setUploading] = useState(false);

  const handleDeptChange = (e) => {
    const dept = e.target.value;
    setSelectedDept(dept);
    setCode(metamodels[dept]);
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value);
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
      };
      reader.readAsText(file);
    }
  };

  const handleUploadToBackend = async () => {
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
    setUploading(false); // Reset loading state
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

      <div className="select-section">
        <label htmlFor="fileSelect" className="label">
          Select Metamodel:
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
