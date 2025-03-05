/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Table, Button, Modal } from "flowbite-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import DijkstraGraph from "./DijkstraGraph"; // Adjust the path as needed

const Dashboard = () => {
  const MySwal = withReactContent(Swal);

  // State variables for bundles and modal views
  const [bundles, setBundles] = useState([]);
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [showBundleModal, setShowBundleModal] = useState(false);
  // The generated graph data for the selected bundle
  const [graphData, setGraphData] = useState(null);

  // Mapping from city to correct state in India.
  const cityToState = {
    Jalandhar: "Punjab",
    Amritsar: "Punjab",
    Delhi: "Delhi",
    Mumbai: "Maharashtra",
    Madurai: "Tamil Nadu",
    Patiyala: "Punjab",
    Coimbatore: "Tamil Nadu",
    Ludhiana: "Punjab",
    Chandigarh: "Chandigarh",
    Bangalore: "Karnataka",
    Hyderabad: "Telangana",
    Vellore: "Tamil Nadu",
  };

  // Simulate fetching 5 bundles with route nodes data.
  useEffect(() => {
    const mockBundles = [
      {
        id: "B001",
        senderNode: { id: "N1", name: "Jalandhar" },
        receiverNode: { id: "N5", name: "Madurai" },
        status: "on-time",
        parcels: [{}, {}, {}],
        routeNodes: [
          {
            id: "N1",
            name: "Jalandhar",
            weather: "Sunny",
            capacity: "High",
            modes: ["Truck", "Rail"],
          },
          {
            id: "N2",
            name: "Amritsar",
            weather: "Cloudy",
            capacity: "Medium",
            modes: ["Truck"],
          },
          {
            id: "N3",
            name: "Delhi",
            weather: "Rainy",
            capacity: "Low",
            modes: ["Air", "Rail"],
          },
          {
            id: "N4",
            name: "Mumbai",
            weather: "Sunny",
            capacity: "High",
            modes: ["Ship", "Air"],
          },
          {
            id: "N5",
            name: "Madurai",
            weather: "Windy",
            capacity: "Medium",
            modes: ["Rail"],
          },
        ],
      },
      {
        id: "B002",
        senderNode: { id: "N6", name: "Patiyala" },
        receiverNode: { id: "N10", name: "Coimbatore" },
        status: "delayed",
        parcels: [{}, {}],
        routeNodes: [
          {
            id: "N6",
            name: "Patiyala",
            weather: "Sunny",
            capacity: "Medium",
            modes: ["Truck", "Rail"],
          },
          {
            id: "N7",
            name: "Amritsar",
            weather: "Cloudy",
            capacity: "High",
            modes: ["Truck"],
          },
          {
            id: "N8",
            name: "Delhi",
            weather: "Rainy",
            capacity: "Low",
            modes: ["Air", "Rail"],
          },
          {
            id: "N9",
            name: "Mumbai",
            weather: "Sunny",
            capacity: "Medium",
            modes: ["Ship", "Air"],
          },
          {
            id: "N10",
            name: "Coimbatore",
            weather: "Windy",
            capacity: "High",
            modes: ["Rail"],
          },
        ],
      },
      {
        id: "B003",
        senderNode: { id: "N11", name: "Ludhiana" },
        receiverNode: { id: "N15", name: "Vellore" },
        status: "on-time",
        parcels: [{}, {}, {}, {}],
        routeNodes: [
          {
            id: "N11",
            name: "Ludhiana",
            weather: "Sunny",
            capacity: "High",
            modes: ["Truck"],
          },
          {
            id: "N12",
            name: "Chandigarh",
            weather: "Clear",
            capacity: "Medium",
            modes: ["Rail"],
          },
          {
            id: "N13",
            name: "Bangalore",
            weather: "Rainy",
            capacity: "Low",
            modes: ["Air"],
          },
          {
            id: "N14",
            name: "Hyderabad",
            weather: "Cloudy",
            capacity: "Medium",
            modes: ["Bus"],
          },
          {
            id: "N15",
            name: "Vellore",
            weather: "Windy",
            capacity: "High",
            modes: ["Rail", "Bus"],
          },
        ],
      },
      {
        id: "B004",
        senderNode: { id: "N16", name: "Amritsar" },
        receiverNode: { id: "N20", name: "Chennai" },
        status: "delayed",
        parcels: [{}, {}, {}],
        routeNodes: [
          {
            id: "N16",
            name: "Amritsar",
            weather: "Sunny",
            capacity: "Medium",
            modes: ["Truck"],
          },
          {
            id: "N17",
            name: "Delhi",
            weather: "Rainy",
            capacity: "Low",
            modes: ["Air", "Rail"],
          },
          {
            id: "N18",
            name: "Hyderabad",
            weather: "Cloudy",
            capacity: "High",
            modes: ["Ship"],
          },
          {
            id: "N19",
            name: "Bangalore",
            weather: "Clear",
            capacity: "Medium",
            modes: ["Bus"],
          },
          {
            id: "N20",
            name: "Chennai",
            weather: "Windy",
            capacity: "High",
            modes: ["Rail", "Air"],
          },
        ],
      },
      {
        id: "B005",
        senderNode: { id: "N21", name: "Chandigarh" },
        receiverNode: { id: "N25", name: "Coimbatore" },
        status: "on-time",
        parcels: [{}, {}],
        routeNodes: [
          {
            id: "N21",
            name: "Chandigarh",
            weather: "Sunny",
            capacity: "High",
            modes: ["Truck", "Rail"],
          },
          {
            id: "N22",
            name: "Delhi",
            weather: "Cloudy",
            capacity: "Medium",
            modes: ["Air"],
          },
          {
            id: "N23",
            name: "Bangalore",
            weather: "Rainy",
            capacity: "Low",
            modes: ["Rail", "Bus"],
          },
          {
            id: "N24",
            name: "Hyderabad",
            weather: "Clear",
            capacity: "Medium",
            modes: ["Bus"],
          },
          {
            id: "N25",
            name: "Coimbatore",
            weather: "Windy",
            capacity: "High",
            modes: ["Rail"],
          },
        ],
      },
    ];
    setBundles(mockBundles);
  }, []);

  /**
   * Helper: Generates graph data (format required by DijkstraGraph)
   * from the bundle's routeNodes.
   * - Each node gets its state from the cityToState mapping and is marked primary if it is the sender or receiver.\n
   * - Sequential connections (bidirectional) are always created between adjacent nodes.\n
   * - Extra edges are added between every pair of nodes (if not already connected) with a 70% chance.\n
   */
  const generateGraphDataFromBundle = (bundle) => {
    const weathers = ["Sunny", "Rainy", "Cloudy", "Windy", "Clear"];
    const loads = ["High", "Medium", "Low"];
    const modes = ["Truck", "Rail", "Air", "Ship", "Bus"];
  
    // Assume cityToState is available in scope.
    const graph = {};
    bundle.routeNodes.forEach((node, index) => {
      graph[node.name] = {
        state: cityToState[node.name] || "Unknown",
        // Sender and receiver are always primary.
        isPrimary: index === 0 || index === bundle.routeNodes.length - 1 ? true : Math.random() < 0.3,
        neighbors: {},
      };
    });
  
    const names = bundle.routeNodes.map((n) => n.name);
    const sourceName = bundle.routeNodes[0].name;
    const destinationName = bundle.routeNodes[bundle.routeNodes.length - 1].name;
  
    // Create sequential (mandatory) connections between adjacent nodes.
    for (let i = 0; i < names.length - 1; i++) {
      const current = names[i];
      const next = names[i + 1];
      const distance = Math.floor(Math.random() * 230) + 20;
      const cost = Math.floor(Math.random() * 400) + 100;
      const weather = weathers[Math.floor(Math.random() * weathers.length)];
      const load = loads[Math.floor(Math.random() * loads.length)];
      const mode = modes[Math.floor(Math.random() * modes.length)];
      graph[current].neighbors[next] = { distance, cost, weather, load, mode };
      graph[next].neighbors[current] = { distance, cost, weather, load, mode };
    }
  
    // Add extra edges between every pair of nodes (if not already connected) with a 70% probability.
    // Avoid adding a direct edge between source and destination.
    for (let i = 0; i < names.length; i++) {
      for (let j = i + 1; j < names.length; j++) {
        const nodeA = names[i];
        const nodeB = names[j];
        if (
          (nodeA === sourceName && nodeB === destinationName) ||
          (nodeA === destinationName && nodeB === sourceName)
        ) {
          continue; // Skip direct edge between sender and receiver.
        }
        if (!graph[nodeA].neighbors[nodeB] && Math.random() < 0.7) {
          const distance = Math.floor(Math.random() * 230) + 20;
          const cost = Math.floor(Math.random() * 400) + 100;
          const weather = weathers[Math.floor(Math.random() * weathers.length)];
          const load = loads[Math.floor(Math.random() * loads.length)];
          const mode = modes[Math.floor(Math.random() * modes.length)];
          graph[nodeA].neighbors[nodeB] = { distance, cost, weather, load, mode };
          graph[nodeB].neighbors[nodeA] = { distance, cost, weather, load, mode };
        }
      }
    }
  
    return graph;
  };
  

  // When a bundle row is clicked, generate its graph data and open the Dijkstra view.
  const handleBundleClick = (bundle) => {
    setSelectedBundle(bundle);
    const generatedGraph = generateGraphDataFromBundle(bundle);
    setGraphData(generatedGraph);
    setShowBundleModal(true);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen dark:bg-slate-800">
      <h1 className="text-2xl font-bold mb-4 mt-12">
        Dynamic Mail Transmission Route Visualization
      </h1>
      <div className="overflow-x-auto">
        <Table>
          <Table.Head>
            <Table.HeadCell>Bundle ID</Table.HeadCell>
            <Table.HeadCell>Sender Node</Table.HeadCell>
            <Table.HeadCell>Receiver Node</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Parcels</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {bundles.map((bundle) => (
              <Table.Row
                key={bundle.id}
                className="bg-white hover:bg-gray-100 dark:bg-slate-400 cursor-pointer"
                onClick={() => handleBundleClick(bundle)}
              >
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-wh">
                  {bundle.id}
                </Table.Cell>
                <Table.Cell className="dark:text-black">
                  {bundle.senderNode.name}
                </Table.Cell>
                <Table.Cell className="dark:text-black">
                  {bundle.receiverNode.name}
                </Table.Cell>
                <Table.Cell>
                  {bundle.status === "delayed" ? (
                    <span className="text-red-500 font-bold">Pending</span>
                  ) : (
                    <span className="text-green-500 dark:text-blue-500 font-bold">
                      Arrived
                    </span>
                  )}
                </Table.Cell>
                <Table.Cell className="dark:text-black">
                  {bundle.parcels.length}
                </Table.Cell>
                <Table.Cell>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBundleClick(bundle);
                    }}
                    gradientDuoTone="purpleToBlue"
                  >
                    Details
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      {/* Bundle Details Modal showing Dijkstra visualization */}
      {selectedBundle && graphData && showBundleModal && (
        <Modal
          show={showBundleModal}
          onClose={() => {
            setShowBundleModal(false);
          }}
          size="8xl" // Increase modal size for the graph
        >
          <Modal.Header>
            Bundle {selectedBundle.id} Details & Route Optimization
          </Modal.Header>
          <Modal.Body>
            <div className="space-y-4 max-h-[90vh]   bg-white p- shadow-md rounded-lg">
              <div className="mb-3">
                <span className="font-bold text-gray-800">Sender:</span>
                <span className="ml-2 text-red-600 font-bold">
                  {selectedBundle.senderNode.name}
                </span>
              </div>
              <div className="mb-3">
                <span className="font-bold text-gray-800">Receiver:</span>
                <span className="ml-2 text-green-600 font-bold">
                  {selectedBundle.receiverNode.name}
                </span>
              </div>
              <div className="mb-3">
                <span className="font-bold text-gray-800">Status:</span>
                <span className="ml-2 text-yellow-600 font-semibold">
                  {selectedBundle.status}
                </span>
              </div>
              <div className="mb-4">
                <span className="font-bold text-gray-800">Parcels Count:</span>
                <span className="ml-2 text-blue-600 font-semibold">
                  {selectedBundle.parcels.length}
                </span>
              </div>
              <hr className="mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Route Optimization via Dijkstra’s Algorithm
              </h3>
              <p className="text-gray-700">
                The graph below is generated from the bundle’s route nodes. Each
                city is assigned to the correct state. Extra edges have been
                added to ensure robust connectivity even when nodes are
                disabled.
              </p>
              <DijkstraGraph
                graphData={graphData}
                source={selectedBundle.senderNode.name}
                destination={selectedBundle.receiverNode.name}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={() => {
                setShowBundleModal(false);
              }}
              color="gray"
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default Dashboard;
