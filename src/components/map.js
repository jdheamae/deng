import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import "./mapdata.css";
import philippineData from '../data/ph.json';
import "leaflet/dist/leaflet.css";

const MapData = () => {
    const [dengueData, setDengueData] = useState([]);
    const [geoJsonData, setGeoJsonData] = useState(philippineData);
    const [totalCases, setTotalCases] = useState(0);
    const [totalDeaths, setTotalDeaths] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dengueCollection = collection(db, "dengueData");
                const dengueSnapshot = await getDocs(dengueCollection);
                const dataList = dengueSnapshot.docs.map((doc) => {
                    const rawData = doc.data();
                    return {
                        Region: rawData.Region,
                        cases: Number(rawData.cases) || 0, // Ensure cases is a number
                        deaths: Number(rawData.deaths) || 0, // Ensure deaths is a number
                    };
                });
        
                // Combine cases and deaths from the same region
                const aggregatedData = dataList.reduce((acc, curr) => {
                    const Region = curr.Region;
                    if (!acc[Region]) {
                        acc[Region] = { cases: 0, deaths: 0 };
                    }
                    acc[Region].cases += curr.cases;
                    acc[Region].deaths += curr.deaths;
                    return acc;
                }, {});
        
                const aggregatedList = Object.keys(aggregatedData).map(Region => ({
                    Region,
                    cases: aggregatedData[Region].cases,
                    deaths: aggregatedData[Region].deaths,
                }));
        
                // Calculate total cases and deaths
                const totalCases = aggregatedList.reduce((sum, region) => sum + region.cases, 0);
                const totalDeaths = aggregatedList.reduce((sum, region) => sum + region.deaths, 0);
        
                setTotalCases(totalCases);
                setTotalDeaths(totalDeaths);
                setDengueData(aggregatedList);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };
        

        fetchData();
    }, []);

    const getColor = (cases) => {
        return cases > 200000
            ? "#4B0082" // Dark Purple for very high cases
            : cases > 150000
            ? "#8B0000" // Dark Red for high cases
            : cases > 100000
            ? "#FF4500" // Orange-Red for moderate cases
            : cases > 50000
            ? "#FF8C00" // Orange for noticeable cases
            : cases > 25000
            ? "#FFD700" // Gold for low cases
            : cases > 10000
            ? "#FFFF00" // Yellow for very low cases
            : "#E0E0E0"; // Gray for no cases
    };

    const normalizeString = (str) => str.toUpperCase().trim();

    const styleFeature = (feature) => {
        const RegionName = normalizeString(feature.properties.name);
        const RegionData = dengueData.find(data => normalizeString(data.Region) === RegionName);
        const cases = RegionData ? RegionData.cases : 0;
        return {
            fillColor: getColor(cases),
            weight: 2,
            opacity: 1,
            color: 'Black',
            dashArray: '2',
        };
    };

    const onEachFeature = (feature, layer) => {
        const RegionName = normalizeString(feature.properties.name);
        const RegionData = dengueData.find(data => normalizeString(data.Region) === RegionName);
        const cases = RegionData ? RegionData.cases : 0;
        const deaths = RegionData ? RegionData.deaths : 0;

        layer.bindTooltip(
            `
            <div>
                <strong>${feature.properties.name}</strong><br />
                <span>Cases: <strong>${cases}</strong></span><br />
                <span>Deaths: <strong>${deaths}</strong></span>
            </div>
            `,
            {
                direction: "center",
                className: "custom-tooltip",
                permanent: false,
                sticky: true,
            }
        );
    };

    return (
        <div className="map-container">
            <h1>Philippines Dengue Cases and Deaths Choropleth Map</h1>
                {/* Summary Card */}
                <div className="summary-container">
                    <div className="summary-card">
                        <p>Total Case: </p>
                        <h2><strong>{totalCases.toLocaleString()}</strong></h2>
                    </div>
                    <div className="summary-card">
                        <p>Total Deaths: </p>
                        <h2><strong>{totalDeaths.toLocaleString()}</strong></h2>
                    </div>
                </div>



            <MapContainer 
                center={[12.8797, 121.7740]}
                zoom={6}
                className="leaflet-container"
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href='https://osm.org/copyright'>OpenStreetMap</a> contributors"
                />
                {dengueData.length > 0 && (
                    <GeoJSON 
                        data={geoJsonData}
                        style={styleFeature}
                        onEachFeature={onEachFeature}
                    />
                )}
            </MapContainer>
        </div>
    );
};

export default MapData;
