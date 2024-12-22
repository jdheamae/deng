import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddDengueData from "./components/AddDengueData";
import DengueDataList from "./components/DengueDataList";
import Sidebar from "./components/sidebar"; // Import Sidebar component
import Analytic from "./components/analy";

function App() {
  return (
    <Router>
      <div className="App">
        <Sidebar /> {/* Include Sidebar here for global layout */}
        <div className="main-content">
          <Routes>
            <Route path="/" element ={<DengueDataList />}  /> 
            <Route path="/add" element={<AddDengueData />} />
            <Route path="/list" element={<DengueDataList />} />
            <Route path="/analy" element={<Analytic />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
