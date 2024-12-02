// DataVisualization.js
import React, { useEffect, useState, useCallback } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import Map from './map'



const Analytic = () => {
  const [dengueData, setdengueData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const natCollection = collection(db, "dengueData");
      const natSnapshot = await getDocs(natCollection);
      const dataList = natSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setdengueData(dataList);
    } catch (error) {
      console.error("Error fetching documents: ", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="data-visualization-page">
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <>
          <Map dengueData={dengueData} />
          
        </>
      )}
    </div>
  );
};

export default Analytic;
