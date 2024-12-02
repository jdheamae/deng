import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import Sidebar from "./sidebar"; // Import the Sidebar component
import CsvUploader from "./csvUpload"; // Import the CsvUploader component
import './AddDengueData.css'; // Import the CSS file

const AddDengueData = () => {
  const [loc, setLocation] = useState("");
  const [cases, setCases] = useState("");
  const [deaths, setDeaths] = useState("");
  const [date, setDate] = useState("");
  const [Region, setRegions] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "dengueData"), {
        loc,
        cases: Number(cases),
        deaths: Number(deaths),
        date,
        Region,
      });
      setLocation("");
      setCases("");
      setDeaths("");
      setDate("");
      setRegions("");
      alert("Data added successfully!");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleUploadComplete = async () => {
    alert("CSV upload successful!");
  };

  return (
    <div className="form-container">
      <Sidebar /> {/* Include Sidebar */}
      <div className="form-content">
        <h2>Add Dengue Data</h2>

        {/* Manual Data Entry Form */}
        <form onSubmit={handleSubmit} className="dengue-form">
          <input
            type="text"
            placeholder="Location"
            value={loc}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Cases"
            value={cases}
            onChange={(e) => setCases(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Deaths"
            value={deaths}
            onChange={(e) => setDeaths(e.target.value)}
            required
          />
          <input
            type="date"
            placeholder="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Regions"
            value={Region}
            onChange={(e) => setRegions(e.target.value)}
            required
          />
          <button type="submit">Add Data</button>
        </form>

        {/* CSV Upload Section */}
          <CsvUploader onUploadComplete={handleUploadComplete} />

      </div>
    </div>
  );
};

export default AddDengueData;
