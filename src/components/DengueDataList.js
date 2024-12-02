import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import CsvUploader from './csvUpload';
import Sidebar from './sidebar'; // Import Sidebar
import './DengueDataList.css'; // Import CSS

const DengueDataList = () => {
  const [dengueData, setDengueData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    loc: '',
    cases: '',
    deaths: '',
    date: '',
    Region: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const fetchData = async () => {
    const dengueCollection = collection(db, 'dengueData');
    const dengueSnapshot = await getDocs(dengueCollection);
    const dataList = dengueSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setDengueData(dataList);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const dengueDocRef = doc(db, 'dengueData', id);
    try {
      await deleteDoc(dengueDocRef);
      setDengueData(dengueData.filter((data) => data.id !== id));
      alert('Data deleted successfully!');
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const handleEdit = (data) => {
    setEditingId(data.id);
    setEditForm({
      loc: data.loc,
      cases: data.cases,
      deaths: data.deaths,
      date: data.date,
      Region: data.Region,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const dengueDocRef = doc(db, 'dengueData', editingId);
    try {
      await updateDoc(dengueDocRef, {
        loc: editForm.loc,
        cases: Number(editForm.cases),
        deaths: Number(editForm.deaths),
        date: editForm.date,
        Region: editForm.Region,
      });
      setDengueData(dengueData.map((data) =>
        data.id === editingId ? { id: editingId, ...editForm } : data
      ));
      setEditingId(null);
      alert('Data updated successfully!');
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  const totalPages = Math.ceil(dengueData.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const paginatedData = dengueData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="dengue-list-container">
      <Sidebar />
      <div className="dengue-list-content">
        <h2>Dengue Data List</h2>
        {editingId ? (
          <form onSubmit={handleUpdate} className="dengue-form">
            <input
              type="text"
              placeholder="Location"
              value={editForm.loc}
              onChange={(e) => setEditForm({ ...editForm, loc: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Cases"
              value={editForm.cases}
              onChange={(e) => setEditForm({ ...editForm, cases: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Deaths"
              value={editForm.deaths}
              onChange={(e) => setEditForm({ ...editForm, deaths: e.target.value })}
              required
            />
            <input
              type="date"
              placeholder="Date"
              value={editForm.date}
              onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Region"
              value={editForm.Region}
              onChange={(e) => setEditForm({ ...editForm, Region: e.target.value })}
              required
            />
            <div className="form-buttons">
              <button type="submit" className="btn update-btn">Update Data</button>
              <button type="button" onClick={() => setEditingId(null)} className="btn cancel-btn">Cancel</button>
            </div>
          </form>
        ) : (
          <>
            <table className="dengue-table">
              <thead>
                <tr>
                  <th>Location</th>
                  <th>Cases</th>
                  <th>Deaths</th>
                  <th>Date</th>
                  <th>Region</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((data) => (
                  <tr key={data.id}>
                    <td>{data.loc}</td>
                    <td>{data.cases}</td>
                    <td>{data.deaths}</td>
                    <td>{data.date}</td>
                    <td>{data.Region}</td>
                    <td>
                      <button onClick={() => handleEdit(data)} className="btn edit-btn">Edit</button>
                      <button onClick={() => handleDelete(data.id)} className="btn delete-btn">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
              <button
                className="btn prev-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="btn next-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DengueDataList;
