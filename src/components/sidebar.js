// Sidebar.js
import React from "react";
import { Link } from "react-router-dom";
import { FaList, FaPlus, FaChartBar } from "react-icons/fa"; // Import icons from react-icons/fa
import './sidebar.css'; // Import the CSS file for sidebar styling

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Dengue Data App</h2>
      <ul>

        <li>
          <Link to="/add">
            <FaPlus /> {/* Icon for Add Data */}
            Add Data
          </Link>
        </li>
        <li>
          <Link to="/list">
            <FaList /> {/* Icon for Data List */}
            Data List
          </Link>
        </li>
        <li>
          <Link to="/analy">
            <FaChartBar  /> {/* Icon for Add Data */}
            Analytics
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
