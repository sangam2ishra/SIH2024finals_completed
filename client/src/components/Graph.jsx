// import React from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
// import { Modal } from 'flowbite-react';
import { useState } from "react";

const statesData = [
  {
    id: 1,
    name: "Andhra Pradesh",
    latitude: 17.679,
    longitude: 83.221,
    color: "red",
    hubs: ["Visakhapatnam", "Vijayawada", "Tirupati"],
  },
  {
    id: 2,
    name: "Arunachal Pradesh",
    latitude: 27.1338,
    longitude: 93.6053,
    color: "blue",
    hubs: ["Itanagar", "Tawang", "Bomdila"],
  },
  {
    id: 3,
    name: "Assam",
    latitude: 26.2006,
    longitude: 92.9376,
    color: "green",
    hubs: ["Guwahati", "Jorhat", "Silchar"],
  },
  {
    id: 4,
    name: "Bihar",
    latitude: 25.0961,
    longitude: 85.3131,
    color: "orange",
    hubs: ["Patna", "Gaya", "Bhagalpur"],
  },
  {
    id: 5,
    name: "Chhattisgarh",
    latitude: 21.2787,
    longitude: 81.655,
    color: "yellow",
    hubs: ["Raipur", "Bilaspur", "Korba"],
  },
  {
    id: 6,
    name: "Goa",
    latitude: 15.2993,
    longitude: 74.124,
    color: "purple",
    hubs: ["Panaji", "Vasco da Gama", "Margao"],
  },
  {
    id: 7,
    name: "Gujarat",
    latitude: 22.2587,
    longitude: 71.1924,
    color: "pink",
    hubs: ["Ahmedabad", "Surat", "Vadodara"],
  },
  {
    id: 8,
    name: "Haryana",
    latitude: 29.0588,
    longitude: 76.0856,
    color: "brown",
    hubs: ["Chandigarh", "Gurugram", "Faridabad"],
  },
  {
    id: 9,
    name: "Himachal Pradesh",
    latitude: 32.0598,
    longitude: 77.1734,
    color: "cyan",
    hubs: ["Shimla", "Manali", "Kullu"],
  },
  {
    id: 10,
    name: "Jharkhand",
    latitude: 23.61,
    longitude: 85.2799,
    color: "gray",
    hubs: ["Ranchi", "Jamshedpur", "Dhanbad"],
  },
  {
    id: 11,
    name: "Karnataka",
    latitude: 15.3173,
    longitude: 75.7139,
    color: "indigo",
    hubs: ["Bengaluru", "Mysuru", "Hubballi"],
  },
  {
    id: 12,
    name: "Kerala",
    latitude: 10.8505,
    longitude: 76.2711,
    color: "violet",
    hubs: ["Thiruvananthapuram", "Kochi", "Kozhikode"],
  },
  {
    id: 13,
    name: "Madhya Pradesh",
    latitude: 23.4735,
    longitude: 77.947,
    color: "teal",
    hubs: ["Bhopal", "Indore", "Gwalior"],
  },
  {
    id: 14,
    name: "Maharashtra",
    latitude: 19.7515,
    longitude: 75.7139,
    color: "lime",
    hubs: ["Mumbai", "Pune", "Nagpur"],
  },
  {
    id: 15,
    name: "Manipur",
    latitude: 24.8031,
    longitude: 93.94,
    color: "aqua",
    hubs: ["Imphal", "Churachandpur", "Kangpokpi"],
  },
  {
    id: 16,
    name: "Meghalaya",
    latitude: 25.467,
    longitude: 91.3662,
    color: "magenta",
    hubs: ["Shillong", "Tura", "Nongstoin"],
  },
  {
    id: 17,
    name: "Mizoram",
    latitude: 23.1645,
    longitude: 92.9376,
    color: "silver",
    hubs: ["Aizawl", "Champhai", "Kolasib"],
  },
  {
    id: 18,
    name: "Nagaland",
    latitude: 26.1584,
    longitude: 94.5624,
    color: "limegreen",
    hubs: ["Kohima", "Dimapur", "Mokokchung"],
  },
  {
    id: 19,
    name: "Odisha",
    latitude: 20.4625,
    longitude: 80.2365,
    color: "maroon",
    hubs: ["Bhubaneswar", "Cuttack", "Berhampur"],
  },
  {
    id: 20,
    name: "Punjab",
    latitude: 31.1471,
    longitude: 75.3412,
    color: "crimson",
    hubs: ["Amritsar", "Chandigarh", "Ludhiana"],
  },
  {
    id: 21,
    name: "Rajasthan",
    latitude: 27.0238,
    longitude: 74.2179,
    color: "orchid",
    hubs: ["Jaipur", "Udaipur", "Jodhpur"],
  },
  {
    id: 22,
    name: "Sikkim",
    latitude: 27.533,
    longitude: 88.5122,
    color: "gold",
    hubs: ["Gangtok", "Mangan", "Namchi"],
  },
  {
    id: 23,
    name: "Tamil Nadu",
    latitude: 11.1271,
    longitude: 78.6569,
    color: "turquoise",
    hubs: ["Chennai", "Coimbatore", "Madurai"],
  },
  {
    id: 24,
    name: "Telangana",
    latitude: 17.1232,
    longitude: 79.2088,
    color: "peachpuff",
    hubs: ["Hyderabad", "Warangal", "Khammam"],
  },
  {
    id: 25,
    name: "Tripura",
    latitude: 23.9408,
    longitude: 91.9882,
    color: "plum",
    hubs: ["Agartala", "Udaipur", "Ambassa"],
  },
  {
    id: 26,
    name: "Uttar Pradesh",
    latitude: 27.2046,
    longitude: 79.0083,
    color: "olive",
    hubs: ["Lucknow", "Kanpur", "Agra"],
  },
  {
    id: 27,
    name: "West Bengal",
    latitude: 22.9868,
    longitude: 87.855,
    color: "salmon",
    hubs: ["Kolkata", "Siliguri", "Durgapur"],
  },
];

const stateConnections = [
  // { from: 1, to: 2, type: "Bus" },  // Andhra Pradesh -> Arunachal Pradesh
  // { from: 1, to: 3, type: "Bus" },  // Andhra Pradesh -> Assam
  { from: 1, to: 4, type: "Bus" }, // Andhra Pradesh -> Bihar
  { from: 1, to: 5, type: "Bus" }, // Andhra Pradesh -> Chhattisgarh
  { from: 7, to: 6, type: "Bus" }, // Gujarat -> Goa
  // { from: 9, to: 10, type: "Flight" },  // Himachal Pradesh -> Jharkhand
  // { from: 7, to: 8, type: "Bus" },  // Gujarat -> Haryana
  // { from: 8, to: 10, type: "Bus" },  // Haryana -> Jharkhand
  { from: 14, to: 13, type: "Bus" }, // Maharashtra -> Madhya Pradesh
  // { from: 14, to: 16, type: "Flight" },  // Maharashtra -> Manipur
  { from: 18, to: 17, type: "Bus" }, // Nagaland -> Mizoram
  { from: 27, to: 26, type: "Bus" }, // West Bengal -> Uttar Pradesh
  // { from: 24, to: 20, type: "Flight" },  // Telangana -> Punjab
  { from: 5, to: 15, type: "Bus" }, // Chhattisgarh -> Manipur
  // { from: 4, to: 17, type: "Bus" },  // Assam -> Mizoram
  { from: 3, to: 17, type: "Bus" }, // Assam -> Mizoram
  { from: 1, to: 24, type: "Bus" }, // Assam -> Mizoram
  { from: 1, to: 23, type: "Bus" }, // Assam -> Mizoram
  { from: 23, to: 12, type: "Bus" }, // Assam -> Mizoram
  { from: 12, to: 6, type: "Bus" }, // Assam -> Mizoram
  { from: 6, to: 11, type: "Bus" }, // Assam -> Mizoram
  { from: 11, to: 14, type: "Bus" }, // Assam -> Mizoram
  { from: 14, to: 7, type: "Bus" }, // Assam -> Mizoram
  { from: 7, to: 21, type: "Bus" }, // Assam -> Mizoram
  { from: 21, to: 13, type: "Bus" }, // Assam -> Mizoram
  { from: 21, to: 8, type: "Bus" }, // Assam -> Mizoram
  { from: 8, to: 20, type: "Bus" }, // Assam -> Mizoram
  { from: 20, to: 9, type: "Bus" }, // Assam -> Mizoram
  { from: 24, to: 11, type: "Bus" }, // Assam -> Mizoram
  { from: 24, to: 19, type: "Bus" }, // Assam -> Mizoram
  { from: 19, to: 5, type: "Bus" }, // Assam -> Mizoram
  { from: 13, to: 19, type: "Bus" }, // Assam -> Mizoram
  { from: 13, to: 10, type: "Bus" }, // Assam -> Mizoram
  { from: 8, to: 26, type: "Bus" }, // Assam -> Mizoram
  // { from: 9, to: 22, type: "Bus" },  // Assam -> Mizoram
  { from: 22, to: 4, type: "Bus" }, // Assam -> Mizoram
  { from: 26, to: 13, type: "Bus" }, // Assam -> Mizoram
  { from: 23, to: 24, type: "Bus" }, // Assam -> Mizoram
  { from: 1, to: 27, type: "Bus" }, // Assam -> Mizoram
  { from: 4, to: 27, type: "Bus" }, // Assam -> Mizoram
  { from: 4, to: 3, type: "Bus" }, // Assam -> Mizoram
  { from: 16, to: 25, type: "Bus" }, // Assam -> Mizoram
  { from: 9, to: 26, type: "Bus" }, // Assam -> Mizoram
  { from: 26, to: 4, type: "Bus" }, // Assam -> Mizoram
  { from: 3, to: 22, type: "Bus" }, // Assam -> Mizoram
  { from: 3, to: 2, type: "Bus" }, // Assam -> Mizoram
  { from: 2, to: 18, type: "Bus" }, // Assam -> Mizoram
  { from: 9, to: 4, type: "Bus" }, // Assam -> Mizoram
  { from: 7, to: 26, type: "Flight" }, // Assam -> Mizoram
  { from: 26, to: 22, type: "Flight" }, // Assam -> Mizoram
  { from: 7, to: 19, type: "Flight" }, // Assam -> Mizoram
  { from: 19, to: 12, type: "Flight" }, // Assam -> Mizoram
  { from: 12, to: 1, type: "Flight" }, // Assam -> Mizoram
  { from: 1, to: 27, type: "Flight" }, // Assam -> Mizoram
  { from: 27, to: 16, type: "Flight" }, // Assam -> Mizoram
  { from: 16, to: 22, type: "Flight" }, // Assam -> Mizoram
  { from: 7, to: 13, type: "Flight" }, // Assam -> Mizoram
  { from: 13, to: 4, type: "Flight" }, // Assam -> Mizoram
  { from: 4, to: 27, type: "Flight" }, // Assam -> Mizoram
  { from: 7, to: 21, type: "Flight" }, // Assam -> Mizoram
  // { from: 21, to: 8, type: "Flight" }, // Assam -> Mizoram
  { from: 21, to: 26, type: "Flight" }, // Assam -> Mizoram
  { from: 26, to: 9, type: "Flight" }, // Assam -> Mizoram
  { from: 9, to: 22, type: "Flight" }, // Assam -> Mizoram
  { from: 7, to: 12, type: "Flight" }, // Assam -> Mizoram
  { from: 21, to: 20, type: "Flight" }, // Assam -> Mizoram
  // { from: 21, to: 20, type: "Ship" }, // Assam -> Mizoram
   { from: 7, to: 6, type: "Ship" }, // Assam -> Mizoram
   { from: 6, to: 12, type: "Ship" }, // Assam -> Mizoram
   { from: 23, to: 1, type: "Ship" }, // Assam -> Mizoram
   { from: 1, to: 25, type: "Ship" }, // Assam -> Mizoram
   { from: 1, to: 27, type: "Ship" }, // Assam -> Mizoram


  // Add more connections between other states
];

// Coordinates for India's bounds
// const indiaBounds = [
//     [6.4623, 68.1266], // South-west
//     [37.0902, 97.4181], // North-east
//   ];
const getEdgeStyle = (type) => {
  // Define styles for different types of transportation
  const styles = {
    Bus: { color: "blue", weight: 2, dashArray: "5,5" }, // Dashed blue line
    Flight: { color: "red", weight: 3, dashArray: null }, // Solid red line
    Ship: { color: "green", weight: 2, dashArray: "10,10" }, // Long dashed green line
    default: { color: "gray", weight: 1, dashArray: null }, // Default style
  };
  return styles[type] || styles.default;
};

const Graph = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const handleStateClick = (state) => {
    setShowModal(true);
    setModalContent(state);
  };

  const getConnectionLine = (from, to) => {
    const stateFrom = statesData.find((state) => state.id === from);
    const stateTo = statesData.find((state) => state.id === to);
    return [
      [stateFrom.latitude, stateFrom.longitude],
      [stateTo.latitude, stateTo.longitude],
    ];
  };
  const edgeTypes = [
    { type: "Bus", color: "blue" },
    { type: "Flight", color: "red" },
    { type: "Ship", color: "green" },
  ];

  return (
    <div className="relative w-full h-screen  rounded-2xl">
       {/* Badges for edge types */}
       <div className="absolute top-2 left-2 z-[1000] ml-10 bg-white p-3 rounded-lg shadow-md flex space-x-4">
        {edgeTypes.map(({ type, color }, index) => (
          <div
            key={index}
            className="flex items-center space-x-2 border rounded px-3 py-1"
            style={{ borderColor: color }}
          >
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: color }}
            ></div>
            <span className="text-sm font-medium text-black">{type}</span>
          </div>
        ))}
      </div>
      <MapContainer
        center={[20.5937, 78.9629]} // Center of India
        zoom={5}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
        maxBounds={[
          [6.4623, 68.1266],
          [37.0902, 97.4181],
        ]}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />
        {stateConnections.map((connection, index) => {
          const { from, to, type } = connection;
          const line = getConnectionLine(from, to);
          const style = getEdgeStyle(type); // Get the style for the connection type

          return (
            <Polyline
              key={index}
              positions={line}
              color={style.color}
              weight={style.weight}
              dashArray={style.dashArray}
            />
          );
        })}
        {statesData.map((state) => (
          <Marker
            key={state.id}
            position={[state.latitude, state.longitude]}
            icon={
              new L.Icon({
                iconUrl: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='${state.color}' /%3E%3C/svg%3E`,
                iconSize: [25, 25],
                iconAnchor: [12, 25],
              })
            }
            eventHandlers={{
              click: () => handleStateClick(state),
            }}
          >
            <Popup>{state.name}</Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Modal with absolute positioning and high z-index */}
      <div
        className={`absolute inset-0 z-[1000] flex items-center justify-center ${
          showModal ? "visible" : "invisible"
        }`}
        style={{
          backgroundColor: showModal ? "rgba(0,0,0,0.5)" : "transparent",
          pointerEvents: showModal ? "auto" : "none",
        }}
      >
        {showModal && (
          <div className="bg-slate-200 rounded-lg shadow-xl max-w-md w-full border border-gray-300">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4 border-b pb-2 border-gray-300">
                <h3 className="text-xl font-semibold text-green-600">
                  {modalContent ? modalContent.name : ""}
                </h3>

                <button
                  onClick={() => setShowModal(false)}
                  className="text-red-600 font-bold bg-red-200 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5"
                >
                  ✕
                </button>
              </div>
              <div>
                <h5 className="text-lg font-semibold mb-2 text-red-500 underline underline-offset-4">
                  Connected Hubs:
                </h5>
                {modalContent &&
                modalContent.hubs &&
                modalContent.hubs.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {modalContent.hubs.map((hub, index) => (
                      <li key={index}>{hub}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No hubs available</p>
                )}
              </div>
              <div className="mt-4 flex justify-end border-t pt-4 border-gray-300">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg transition duration-150 ease-in-out"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Graph;