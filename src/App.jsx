import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import ChatBot from "./components/ChatBot";
import MetaModel from "./components/MetaModel";
// import Login from "./components/Login";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chatbot" element={<ChatBot />} />
        <Route path="/metamodel" element={<MetaModel />} />
      </Routes>
    </BrowserRouter>
    // <div className="App">
    //   {/* <Login></Login> */}
    //   <ChatBot></ChatBot>
    // </div>
  );
}

export default App;
