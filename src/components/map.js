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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dengueCollection = collection(db, "dengueData");
                const dengueSnapshot = await getDocs(dengueCollection);
                const dataList = dengueSnapshot.docs.map((doc) => ({
                    Region: doc.data().Region,
                    cases: doc.data().cases,
                    deaths: doc.data().deaths, // Include deaths data
                }));

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

                setDengueData(aggregatedList);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, []);

    const getColor = (cases) => {
        return cases > 5000
            ? "#800026"
            : cases > 1000
            ? "#BD0026"
            : cases > 500
            ? "#E31A1C"
            : cases > 100
            ? "#FC4E2A"
            : cases > 50
            ? "#FD8D3C"
            : cases > 10
            ? "#FEB24C"
            : cases > 0
            ? "#FED976"
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
            color: 'red',
            dashArray: '2',
        };
    };

    const onEachFeature = (feature, layer) => {
        const RegionName = normalizeString(feature.properties.name);
        const RegionData = dengueData.find(data => normalizeString(data.Region) === RegionName);
        const cases = RegionData ? RegionData.cases : 0;
        const deaths = RegionData ? RegionData.deaths : 0;

        // Use HTML for better formatting
        layer.bindTooltip(
            `
            <div>
                <strong>${feature.properties.name}</strong><br />
                <span>Cases: <strong>${cases}</strong></span><br />
                <span>Deaths: <strong>${deaths}</strong></span>
            </div>
            `,
            {
                direction: "center", // Center the tooltip over the region
                className: "custom-tooltip",
                permanent: false, // Tooltip only visible on hover
                sticky: true, // Tooltip follows the mouse pointer
            }
        );
    };

    return (
        <div className="map-container">
            <h1>Philippines Dengue Cases and Deaths Choropleth Map</h1>
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
