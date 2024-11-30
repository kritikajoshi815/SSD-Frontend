import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Editor,{useMonaco} from "@monaco-editor/react";
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

const departments = [
  "Underwriting", "Claims", "Actuarial", "Sales and Marketing", "Customer Service", "Policy Administration", "Finance and Accounting", "Legal and Compliance", "Information Technology (IT)", "Human Resources (HR)", "Risk Management", "Reinsurance", "Product Development"
];

function CodeEditor() {
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const [selectedDept, setSelectedDept] = useState("Finance and Accounting");
  const [metamodels, setMetamodels] = useState(departments);
  const [code, setCode] = useState("coding ...");
  const [uploading, setUploading] = useState(false);
  const [jsonError, setJsonError] = useState(null); // Track JSON error message
  const [editorInstance, setEditorInstance] = useState(null);
  const [fileUpload,setFileUpload] = useState(false);
  const monaco = useMonaco();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:6001/api/isAuth', {
          method: 'GET',
          credentials: 'include'
        });
        if (response.ok) {
          const userSession = await response.json();
          //console.log(userSession);
          setUserEmail(userSession.email);
          setUserName(userSession.name);
          return;
        } else {
          const errorData = await response.text(); // Get the raw text to see the error
          navigate("/");
          console.log('User is not authenticated:', errorData);
        }
      } catch (error) {
        console.log(error);
        navigate('/')
        setError('An error occurred during Authentication');
      }
    }
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    const loadMetaModel = async () => {
      if (!selectedDept) return; // Wait until userEmail is set

      try {
        const response = await fetch(
          `http://localhost:6001/api/metaModel/${encodeURIComponent(selectedDept)}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json(); // Wait for the JSON response
          console.log(data); // Log the entire response for debugging

          // Extract modelData and convert it to a string (e.g., JSON string)
          const modelDataString = JSON.stringify(data.modelData,null, 2);
          //console.log(modelDataString);
          setCode(modelDataString);
          // Here you can set previous chats into your state if needed, e.g., setPrevChats(previousChats);
        } else {
          console.log("Failed to load Meta Model");
        }
      } catch (error) {
        console.log(error);
      }
    };

    if(!fileUpload){loadMetaModel();}
    else{
      setFileUpload(false);
    }

  }, [selectedDept]);

  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme("customTheme", {
        base: "vs-dark", // Use the dark base theme as a starting point
        inherit: true,
        rules: [
          { token: "", background: "1b1b1b" }, // Set the editor background
          { token: "string", foreground: "87d7ff" }, // Light blue strings
          { token: "keyword", foreground: "ffa07a" }, // Salmon keywords
          { token: "number", foreground: "eedd82" }, // Light golden numbers
          { token: "comment", foreground: "8f8f8f", fontStyle: "italic" }, // Grey italic comments
        ],
        colors: {
          "editor.background": "#333333", // Dark background color
          "editor.foreground": "#eaeaea", // Light text
          "editorLineNumber.foreground": "#5e5e5e", // Grey line numbers
          "editor.selectionBackground": "#333c4a", // Slightly lighter selection
        },
      });
      monaco.editor.setTheme("customTheme");
    }
  }, [monaco]);

  const handleDeptChange = (e) => {
    const dept = e.target.value;
    setSelectedDept(dept);
    setCode("coding..");
    setJsonError(null); // Reset error on department change
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    validateJson(newCode); // Validate JSON on code change
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const fileContent = event.target.result;
          const jsonData = JSON.parse(fileContent); // Parse JSON from file
  
          if (jsonData.department) {
            setFileUpload(true);
            setSelectedDept(jsonData.department); // Extract department and set it
            setCode(JSON.stringify(jsonData, null, 2)); // Set the JSON content as code
            validateJson(fileContent); // Validate JSON content
          } else {
            alert("Department not found in the file. Please select a valid file."); // Show alert
            e.target.value = ""; // Deselect/discard the file
          }
        } catch (error) {
          console.error("Invalid JSON format:", error);
          alert("Invalid JSON file. Please ensure it contains valid JSON data.");
          e.target.value = ""; // Deselect/discard the file
        }
      };
      reader.readAsText(file); // Read the file as text
    }
  };

  const validateJson = (text) => {
    try {
      JSON.parse(text); // Attempt to parse JSON
      monaco.editor.setModelMarkers(editorInstance.getModel(), "json", []); // Clear any previous markers
      setJsonError(null);
    } catch (error) {
      const errorPosition = parseErrorPosition(text, error.message);
      if (errorPosition) {
        const markers = [
          {
            startLineNumber: errorPosition.line,
            startColumn: errorPosition.column,
            endLineNumber: errorPosition.line,
            endColumn: errorPosition.column + 1,
            message: error.message,
            severity: monaco.MarkerSeverity.Error,
          },
        ];
        monaco.editor.setModelMarkers(editorInstance.getModel(), "json", markers);
        setJsonError(
          `JSON Error at line ${errorPosition.line}, column ${errorPosition.column}: ${error.message}`
        );
        highlightError(errorPosition.line);
      }else {
        setJsonError(`JSON Error: ${error.message}`);
      }
    }
  };

  // Parse error position from the error message
  const parseErrorPosition = (text, errorMessage) => {
    const lines = text.split("\n");
    const match = errorMessage.match(/position (\d+)/); // Extract position from error
    if (match) {
      const position = parseInt(match[1], 10);
      let charCount = 0;
      for (let i = 0; i < lines.length; i++) {
        const lineLength = lines[i].length + 1; // +1 for newline character
        if (charCount + lineLength > position) {
          return { line: i , column: position - charCount + 1 };
        }
        charCount += lineLength;
      }
    }
    return null;
  };

  const handleUploadToBackend = async () => {
    // Check if JSON is valid before uploading
    if (jsonError) {
      alert("Cannot upload. Fix JSON syntax errors first.");
      return;
    }

    setUploading(true); // Show loading state
    try {
      const response = await fetch(`http://localhost:6001/api/metaModel/${encodeURIComponent(selectedDept)}`, {
        method: "PUT", // Use PUT to update the metamodel
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ // Pass the department name
          metamodel: code, // Pass the updated metamodel content
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to upload metamodel: ${errorData.message || "Unknown error"}`);
      }
  
      alert("Metamodel updated successfully!");
    } catch (error) {
      console.error("Error updating metamodel:", error);
      alert(`Error updating metamodel: ${error.message}`);
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
        {departments.map((dept) => (
          <option key={dept} value={dept}>
            {dept}
          </option>
        ))}
      </select>
      <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl">
      <Editor
        height="85vh"
        width="100%"
        language="json"
        value={code}
        onChange={handleCodeChange}
        onMount={(editor, monaco) => {
          setEditorInstance(editor);
          monaco.editor.setTheme("customTheme");
        }}
        options={{
          automaticLayout: true,
          scrollBeyondLastLine: false,
          minimap: { enabled: false },
        }}
      />
    </div>

      {/* <div className="editor-container">
        <div className="line-numbers">
          {code.split("\n").map((_, index) => (
            <div key={index}>{index + 1}</div>
          ))}
        </div>

        <textarea
          className="code-editor"
          value={code}
          onChange={handleCodeChange}
          onMouseMove={handleMouseMove}
          style={{ paddingLeft: '40px' }} // Adjust padding for line numbers
        />
      </div> */}

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
          accept=".txt,.xml,.json"
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
