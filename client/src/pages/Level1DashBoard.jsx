/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Button, Modal, Sidebar } from "flowbite-react";
import {
  MapPinCheckIcon,
  Cloud,
  AlertCircle,
  Archive,
  Truck,
  Home,
  Train,
} from "lucide-react";
import { useSelector } from "react-redux";
import { AllParcel } from './../components/AllParcel';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function Level1DashBoard() {
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser);
  const { transportationModes } = currentUser;
    console.log(transportationModes);
  const [level2Nodes, setLevel2Nodes] = useState([]);
  const [level1ConnectedNodes, setLevel1ConnectedNodes] = useState([]);
  const [nodeDetails, setNodeDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const MySwal = withReactContent(Swal);
  const [viewingLevel, setViewingLevel] = useState("level2"); // Tracks which nodes to display ('level1' or 'level2')
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transport, setTransport] = useState(false);
  const [modalType, setModalType] = useState(""); // Either 'message' or 'alert'
  const [selectedNode, setSelectedNode] = useState(null);
  const [messageContent, setMessageContent] = useState("");
  const [modalOpen, setModalOpen] = useState(false); // Modal state for adding transportation mode
  const [newTransportData, setNewTransportData] = useState({
    number: "",
    departureTime: "",
    arrivalTime: "",
    mode: "",
  }); // New transport data for modal
  const [selectedMode, setSelectedMode] = useState(""); 

  useEffect(() => {
    // Simulate API call to fetch Level 1 Node data
    setTimeout(() => {
      // Example mock data for the Level 1 Node
      setNodeDetails({
        nodeId: "L1-001",
        name: "Main Airport Hub",
        location: { latitude: 40.7128, longitude: -74.006 },
        transportationModes: ["Flight", "Truck"],
        storageCapacity: 5000,
        currentLoad: 3500,
        weatherConditions: "Good",
      });
      setLevel1ConnectedNodes([
        {
          nodeId: "L1-101",
          name: "Regional Hub A",
          location: { latitude: 38.9072, longitude: -77.0369 },
          storageCapacity: 4000,
          currentLoad: 3000,
          weatherConditions: "Cloudy",
          transportationModes: ["Truck", "Train"],
        },
        {
          nodeId: "L1-102",
          name: "Regional Hub B",
          location: { latitude: 37.7749, longitude: -122.4194 },
          storageCapacity: 4500,
          currentLoad: 3200,
          weatherConditions: "Sunny",
          transportationModes: ["Truck"],
        },
      ]);

      setLevel2Nodes([
        {
          nodeId: "L2-101",
          name: "City Hub A",
          location: { latitude: 39.9526, longitude: -75.1652 },
          postOffices: ["Post Office 1", "Post Office 2"],
          transportationModes: ["Truck"],
          storageCapacity: 3000,
          currentLoad: 1500,
        },
        {
          nodeId: "L2-102",
          name: "City Hub B",
          location: { latitude: 34.0522, longitude: -118.2437 },
          postOffices: ["Post Office 3", "Post Office 4"],
          transportationModes: ["Truck", "Train"],
          storageCapacity: 4000,
          currentLoad: 3000,
        },
        {
          nodeId: "L2-103",
          name: "City Hub C",
          location: { latitude: 41.8781, longitude: -87.6298 },
          postOffices: ["Post Office 5"],
          transportationModes: ["Train"],
          storageCapacity: 2000,
          currentLoad: 800,
        },
        {
          nodeId: "L2-104",
          name: "City Hub D",
          location: { latitude: 51.8781, longitude: -70.6298 },
          postOffices: ["Post Office 6"],
          transportationModes: ["Train", "Truck"],
          storageCapacity: 1000,
          currentLoad: 700,
        },
        {
          nodeId: "L2-105",
          name: "City Hub C",
          location: { latitude: 59.8781, longitude: -90.6298 },
          postOffices: ["Post Office 7"],
          transportationModes: ["Train", "Bus"],
          storageCapacity: 1500,
          currentLoad: 1200,
        },
        {
          nodeId: "L2-106",
          name: "City Hub C",
          location: { latitude: 91.8781, longitude: -80.6298 },
          postOffices: ["Post Office 5"],
          transportationModes: ["Train"],
          storageCapacity: 3000,
          currentLoad: 2000,
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSendMessage = (nodeId) => {
    setModalType("message");
    setSelectedNode(nodeId);
    setIsModalOpen(true);
  };

  const handleSendAlert = (nodeId) => {
    setModalType("alert");
    setSelectedNode(nodeId);
    setIsModalOpen(true);
  };

  const handleGlobalMessage = () => {
    setModalType("message");
    setSelectedNode("all");
    setIsModalOpen(true);
  };

  const handleGlobalAlert = () => {
    setModalType("alert");
    setSelectedNode("all");
    setIsModalOpen(true);
  };

  const handleTransport=()=>{
    setTransport(!transport);
    console.log("Transpoe");
  }

  const handleModalSubmit = async() => {
    // Submit the new transportation mode data (for example, logging it)
    const payload = {
      selectedMode,
      name: currentUser.name,
      transportationModes: newTransportData
    };

    console.log(payload);
    console.log(selectedMode);
    console.log("New Transport Submitted:", newTransportData);
    console.log(payload);
    console.log(selectedMode);
    console.log("New Transport Submitted:", newTransportData);
     // Open the modal and set the mode for the new transportation data
    const res = await fetch("/api/nodes/addTransport", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data=res.json();
    console.log(data);

     MySwal.fire({
      icon: "success",
      title: "Added ",
      text: "You Have Suucessfully updated your transportation mode",
    });
    setModalOpen(false); // Close the modal after submitting
  };

  const handleAddTransportation = (mode) => {
   
    setSelectedMode(mode);
    setModalOpen(true);
    setNewTransportData({
      number: "",
      departureTime: "",
      arrivalTime: "",
      mode: mode,
    });
  };


  const sendNotification = async () => {
    try {

      MySwal.fire({
        icon: "success",
        title: "NOTIFICATION ",
        text: "Message Sent",
      });
      const endpoint =
        selectedNode === "all"
          ? "/api/notify/all"
          : `/api/notify/${selectedNode}`;
      await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: modalType,
          message: messageContent,
        }),
      });
      // alert(
      //   `${modalType === "message" ? "Message" : "Alert"} sent successfully`
      // );
    } catch (error) {
      console.error("Error sending notification:", error);
      alert("Failed to send notification");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  const updateTransportationMode = (mode, newCount) => {
    // Update transportation mode logic (for simplicity, just logging the change)
    console.log(`Updated ${mode} count to ${newCount}`);
  };
  const renderTransportationModes = () => {
    const { transportationModes } = currentUser;
    console.log(transportationModes);
    return Object.keys(transportationModes).map((mode) => (
      <div key={mode} className="mb p-11 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="flex justify-between items-center bg-slate-400 dark:bg-slate-600 rounded-md p-2">
          <h3 className="font-semibold text-lg capitalize">
            {mode} <span className="text-sm">({transportationModes[mode].length} Vehicles)</span>
          </h3>
          <Button
          gradientDuoTone="purpleToBlue"
          outline
            className="text-black   "
            onClick={() => handleAddTransportation(mode)}
          >
            Add Transportation
          </Button>
        </div>
        <ul className="space-y-4 mt-4">
          {transportationModes[mode].map((transport) => (
            <li key={transport._id} className="flex items-center justify-between">
              <div className="flex flex-col bg-gray-300 dark:bg-gray-700 p-3 rounded-md shadow-2xl ">
                <span>
                  <strong>Transport Number:</strong> {transport.number}
                </span>
                <span>
                  <strong>Departure:</strong> {new Date(transport.departureTime).toLocaleTimeString()}
                </span>
                <span>
                  <strong>Arrival:</strong> {new Date(transport.arrivalTime).toLocaleTimeString()}
                </span>
              </div>
              
            </li>
          ))}
        </ul>
        <Modal show={modalOpen} onClose={() => setModalOpen(false)}>
        <Modal.Header>
          <h3 className="text-lg font-semibold">
            Add New {selectedMode.charAt(0).toUpperCase() + selectedMode.slice(1)} Transportation
          </h3>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              placeholder="Transport Number"
              value={newTransportData.number}
              onChange={(e) => setNewTransportData({ ...newTransportData, number: e.target.value })}
            />
            <input
              type="datetime-local"
              className="w-full p-2 border rounded-md"
              placeholder="Departure Time"
              value={newTransportData.departureTime}
              onChange={(e) => setNewTransportData({ ...newTransportData, departureTime: e.target.value })}
            />
            <input
              type="datetime-local"
              className="w-full p-2 border rounded-md"
              placeholder="Arrival Time"
              value={newTransportData.arrivalTime}
              onChange={(e) => setNewTransportData({ ...newTransportData, arrivalTime: e.target.value })}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
            onClick={handleModalSubmit}
          >
            Submit
          </button>
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
            onClick={() => setModalOpen(false)}
          >
            Cancel
          </button>
        </Modal.Footer>
      </Modal>
      </div>
    ));
  };

  const renderNodes = () => {
    let nodes = {};
    nodes = viewingLevel === "level1" ? level1ConnectedNodes : level2Nodes;

    console.log(viewingLevel);
    console.log(nodes);

    return (
      <>
        <div className="w-full ">
          <h3 className="text-center p-4 w-full dark:text-black font-bold  bg-gradient-to-r from-blue-700 via-blue-100 to-blue-800">
            {viewingLevel === "level1"
              ? "Connected States Nodes"
              : "Connected Cities Nodes"}
          </h3>
          <div className="flex justify-end gap-4 mb-4 mt-2">
            {/* Global Buttons */}
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-700"
              onClick={handleGlobalMessage}
            >
              Send Message to All
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-md shadow hover:bg-red-700"
              onClick={handleGlobalAlert}
            >
              Send Alert to All
            </button>
          </div>

          <div className="mx-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nodes.map((node) => (
              <div
                key={node.nodeId}
                className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow-2xl"
              >
                <h4 className="text-lg font-semibold mb-2">{node.name}</h4>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <MapPinCheckIcon size={18} className="text-green-500" />
                    <span>
                      <strong>Location:</strong> Latitude{" "}
                      {node.location.latitude}, Longitude{" "}
                      {node.location.longitude}
                    </span>
                  </li>

                  {viewingLevel === "level2" && (
                    <>
                      <li className="flex items-center space-x-2">
                        <Home size={18} className="text-orange-400" />
                        <span>
                          <strong>Post Offices:</strong>{" "}
                          {node.postOffices.join(", ")}
                        </span>
                      </li>
                    </>
                  )}

                  <li className="flex items-center space-x-2">
                    <Truck size={18} className="text-blue-500" />
                    <Train size={18} className="text-blue-600" />
                    <span>
                      <strong>Transport:</strong>{" "}
                      {node.transportationModes.join(", ")}
                    </span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Archive
                      size={18}
                      className="text-orange-500 dark:text-yellow-300"
                    />
                    <span>
                      <strong>Storage:</strong> {node.currentLoad}/
                      {node.storageCapacity} kg
                    </span>
                  </li>
                </ul>
                <div className="flex justify-between mt-4">
                  <button
                    className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-700"
                    onClick={() => handleSendMessage(node.nodeId)}
                  >
                    Send Message
                  </button>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-700"
                    onClick={() => handleSendAlert(node.nodeId)}
                  >
                    Send Alert
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <Modal.Header>
            {" "}
            <div className="flex items-center gap-2">
              {modalType === "alert" ? (
                <span className="text-red-600">
                  {/* Alert symbol */}
                  ⚠️
                </span>
              ) : (
                <span className="text-blue-600">
                  {/* Message symbol */}
                  📩
                </span>
              )}
              <h2 className="text-lg font-semibold">
                {modalType === "alert" ? "Send Alert" : "Send Message"}
              </h2>
            </div>
          </Modal.Header>
          <Modal.Body
            className={`rounded-lg ${
              modalType === "alert" ? "bg-red-200" : "bg-blue-200"
            }`}
          >
            <textarea
              className="w-full p-2 border rounded-md"
              rows="4"
              placeholder={`Enter your ${
                modalType === "message" ? "message" : "alert"
              } here...`}
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
            ></textarea>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
              onClick={() => {
                sendNotification();
                setIsModalOpen(false);
              }}
            >
              Submit
            </button>
            <button
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row mt-10 bg-gray-200 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      {/* Sidebar Section */}
      <div className="md:w-80 bg-gray-500">
        <Sidebar>
          <div
            className="p-4 shadow-2xl bg-gray-200 
        rounded-md dark:bg-slate-600 my-2"
          >
             <button
              className={`w-full mb-2 p-2 rounded-md ${
                viewingLevel === "All Parcel"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700"
              } hover:bg-gray-400`}
              onClick={() => setViewingLevel("All Parcel")}
            >
              All Parcel
            </button>
            <button
              className={`w-full mb-2 p-2 rounded-md ${
                viewingLevel === "level1"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700"
              } hover:bg-gray-400`}
              onClick={() => setViewingLevel("level1")}
            >
              States Nodes
            </button>
            <button
              className={`w-full mb-2 p-2 rounded-md ${
                viewingLevel === "level2"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700"
              } hover:bg-gray-400`}
              onClick={() => setViewingLevel("level2")}
            >
              Cities Nodes
            </button>
          </div>
          <div className="p-4 shadow-2xl bg-gray-200 rounded-md dark:bg-slate-600 my-2">
            <h3 className="text-center font-bold text-xl mb-4">Level 1 Node</h3>
            <p className="mb-2">
              <strong>Name:</strong> {currentUser.name}
            </p>
            <p className="mb-2">
              <MapPinCheckIcon className="text-green-500 font-extrabold size-8" />
              <strong>Location:</strong> Latitude{" "}
              {currentUser.location.latitude}, Longitude{" "}
              {currentUser.location.longitude}
            </p>

            <p className="mb-2"  onClick={handleTransport}>
              <Truck className="text-blue-500  size-8" />
              <strong>Transportation:</strong>{" "}
              {nodeDetails.transportationModes.join(", ")}
            </p>
            <p className="mb-2">
              <Archive className="text-orange-400 dark:text-yellow-200 size-8 " />
              <strong>Storage:</strong> {nodeDetails.currentLoad}/
              {currentUser.storageCapacity} kg
            </p>
            <p className="mb-2">
              <Cloud className="text-blue-400  size-8" />
              <strong>Weather:</strong> {currentUser.weatherConditions}
            </p>
            <p className="mb-2">
              <AlertCircle className="text-red-500 size-6 " />
              
              <strong>Alert :</strong> {currentUser.Alert}
            </p>
          </div>
        </Sidebar>
      </div>
 
      {/* Main Content Section */}
      {viewingLevel === 'All Parcel' 
  ? <>  <AllParcel>  </AllParcel> </>
  : <>
      {!transport 
        ? renderNodes() 
        : <div className="flex flex-col w-full">
            <h3 className="text-center p-4 w-full dark:text-black font-bold bg-gradient-to-r from-blue-700 via-blue-100 to-blue-800">
              Mode of Transportation
            </h3>
            {renderTransportationModes()}
          </div>
      }
    </>
}
     
    </div>
  );
}
