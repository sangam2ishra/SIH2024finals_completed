/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  MarkerType
} from 'react-flow-renderer';
import { Modal, Button } from 'flowbite-react';

/**
 * Dijkstra’s Algorithm Implementation.
 * It uses a combined weight (distance + cost) to determine the optimal path.
 */
function dijkstra(graphData, source, target, disabledNodes = []) {
  const combined = {};
  const previous = {};
  const unvisited = new Set(Object.keys(graphData));

  for (let city in graphData) {
    combined[city] = Infinity;
    previous[city] = null;
  }
  combined[source] = 0;

  while (unvisited.size > 0) {
    let currentCity = null;
    let minCombined = Infinity;
    for (let city of unvisited) {
      if (combined[city] < minCombined) {
        minCombined = combined[city];
        currentCity = city;
      }
    }
    if (currentCity === null) break;
    if (currentCity === target) break;

    unvisited.delete(currentCity);
    const neighbors = graphData[currentCity].neighbors;
    for (let neighbor in neighbors) {
      if (disabledNodes.includes(neighbor) || disabledNodes.includes(currentCity)) continue;
      // Use combined weight = distance + cost.
      const weight = neighbors[neighbor].distance + neighbors[neighbor].cost;
      const alt = combined[currentCity] + weight;
      if (alt < combined[neighbor]) {
        combined[neighbor] = alt;
        previous[neighbor] = currentCity;
      }
    }
  }

  const path = [];
  let current = target;
  while (current) {
    path.unshift(current);
    current = previous[current];
  }
  return combined[target] === Infinity ? null : path;
}

/**
 * Build React Flow elements from the graphData.
 * Primary nodes are positioned on the top row while secondary nodes appear on the bottom row.
 * Source and destination nodes have distinct styling.
 */
function buildFlowElements(graphData, disabledNodes, source, destination) {
  const nodes = [];
  const edges = [];

  // Helper function for node style.
  const getNodeStyle = (city, isDisabled) => {
    if (city === source) {
      return {
        background: isDisabled
          ? '#fef3c7'
          : 'linear-gradient(135deg, #fb923c, #f97316)', // gradient orange for source
        color: '#fff',
        padding: 12,
        borderRadius: '50%',
        textAlign: 'center',
        border: '3px solid #fff',
        fontWeight: 'bold',
        boxShadow: '0px 4px 12px rgba(251,146,60,0.5)'
      };
    }
    if (city === destination) {
      return {
        background: isDisabled
          ? '#fce7f3'
          : 'linear-gradient(135deg, #f472b6, #ec4899)', // gradient purple for destination
        color: '#fff',
        padding: 12,
        borderRadius: '50%',
        textAlign: 'center',
        border: '3px solid #fff',
        fontWeight: 'bold',
        boxShadow: '0px 4px 12px rgba(236,72,153,0.5)'
      };
    }
    if (graphData[city].isPrimary) {
      return {
        background: isDisabled ? '#d1d5db' : '#2563eb', // blue for primary
        color: '#fff',
        padding: 10,
        borderRadius: '50%',
        textAlign: 'center',
        border: '2px solid #fff',
        fontWeight: 'bold',
        boxShadow: '0px 3px 8px rgba(37,99,235,0.5)'
      };
    }
    // Secondary nodes styling.
    return {
      background: isDisabled ? '#d1d5db' : '#10b981', // green for secondary
      color: '#fff',
      padding: 10,
      borderRadius: '50%',
      textAlign: 'center',
      border: '2px solid #fff',
      fontWeight: 'bold',
      boxShadow: '0px 3px 8px rgba(16,185,129,0.5)'
    };
  };

  // Arrange nodes into primary and secondary groups.
  const primaryNodes = [];
  const secondaryNodes = [];

  Object.keys(graphData).forEach((city) => {
    if (graphData[city].isPrimary) {
      primaryNodes.push(city);
    } else {
      secondaryNodes.push(city);
    }
  });

  primaryNodes.forEach((city, index) => {
    const isDisabled = disabledNodes.includes(city);
    nodes.push({
      id: city,
      position: { x: index * 250, y: 50 },
      data: { label: `${city} (${graphData[city].state})` },
      style: getNodeStyle(city, isDisabled)
    });
  });

  secondaryNodes.forEach((city, index) => {
    const isDisabled = disabledNodes.includes(city);
    nodes.push({
      id: city,
      position: { x: index * 250, y: 200 },
      data: { label: `${city} (${graphData[city].state})` },
      style: getNodeStyle(city, isDisabled)
    });
  });

  // Create edges between nodes.
  Object.keys(graphData).forEach((city) => {
    const { neighbors } = graphData[city];
    for (let neighbor in neighbors) {
      if (disabledNodes.includes(neighbor) || disabledNodes.includes(city)) continue;
      edges.push({
        id: `edge-${city}-${neighbor}`,
        source: city,
        target: neighbor,
        label: String(neighbors[neighbor].distance),
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { strokeWidth: 2, stroke: '#888' },
        labelBgPadding: [8, 4],
        labelBgBorderRadius: 4,
        labelBgStyle: { fill: '#fff', color: '#000', fillOpacity: 0.7 }
      });
    }
  });

  return { nodes, edges };
}

/**
 * DijkstraGraph Component.
 * Props:
 *   - graphData: the graph data (must include both primary and secondary nodes).
 *   - source: source node name.
 *   - destination: destination node name.
 */
export default function DijkstraGraph({ graphData, source, destination }) {
  const [disabledNodes, setDisabledNodes] = useState([]);
  const [optimalPath, setOptimalPath] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [reactFlowNodes, setNodes, onNodesChange] = useNodesState([]);
  const [reactFlowEdges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showNodeModal, setShowNodeModal] = useState(false);

  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = buildFlowElements(
      graphData,
      disabledNodes,
      source,
      destination
    );
    setNodes(newNodes);
    setEdges(newEdges);
  }, [graphData, disabledNodes, setNodes, setEdges, source, destination]);

  useEffect(() => {
    const path = dijkstra(graphData, source, destination, disabledNodes);
    setOptimalPath(path || []);

    // Calculate total cost and distance along the path if it exists.
    if (path && path.length > 1) {
      let costSum = 0;
      let distanceSum = 0;
      for (let i = 0; i < path.length - 1; i++) {
        const current = path[i];
        const next = path[i + 1];
        if (graphData[current].neighbors[next]) {
          costSum += graphData[current].neighbors[next].cost;
          distanceSum += graphData[current].neighbors[next].distance;
        }
      }
      setTotalCost(costSum);
      setTotalDistance(distanceSum);
    } else {
      setTotalCost(0);
      setTotalDistance(0);
    }
  }, [graphData, source, destination, disabledNodes]);

  const onNodeClick = useCallback(
    (event, node) => {
      event.preventDefault();
      const cityName = node.id;
      const nodeData = graphData[cityName];
      const neighbors = nodeData.neighbors || {};
      const neighborKey = Object.keys(neighbors)[0];
      let weather = 'N/A';
      let load = 'N/A';
      let mode = 'N/A';
      let cost = 0;
      let distance = 0;
      if (neighborKey) {
        weather = neighbors[neighborKey].weather;
        load = neighbors[neighborKey].load;
        mode = neighbors[neighborKey].mode;
        cost = neighbors[neighborKey].cost;
        distance = neighbors[neighborKey].distance;
      }
      setSelectedNode({
        name: cityName,
        state: nodeData.state,
        isPrimary: nodeData.isPrimary,
        weather,
        load,
        mode,
        cost,
        distance,
      });
      setShowNodeModal(true);
    },
    [graphData]
  );

  const handleDisableNode = (cityName) => {
    if (cityName === source || cityName === destination) {
      alert(`Cannot disable source (${source}) or destination (${destination}).`);
      return;
    }
    setDisabledNodes((prev) => [...prev, cityName]);
    setShowNodeModal(false);
  };

  const handleEnableNode = (cityName) => {
    setDisabledNodes((prev) => prev.filter((name) => name !== cityName));
    setShowNodeModal(false);
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-screen mt-6 bg-gradient-to-r from-gray-100 to-gray-200 p-4">
      {/* Graph Visualization Panel */}
      <div className="md:w-2/3 w-full h-full border-r bg-white shadow-lg rounded-lg p-4 mb-4 md:mb-0">
        <ReactFlow
          nodes={reactFlowNodes}
          edges={reactFlowEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          fitView
          style={{ background: '#f0f0f0', borderRadius: '8px' }}
        >
          <Background variant="dots" gap={12} size={1} />
          <Controls />
        </ReactFlow>
      </div>

      {/* Details Panel */}
      <div className="md:w-1/3 w-full p-6 overflow-auto bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Optimized Route</h2>
        <p className="text-gray-700 mb-1">
          <strong>Source:</strong>{" "}
          <span className="text-orange-500 font-bold">{source}</span>
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Destination:</strong>{" "}
          <span className="text-green-500 font-extrabold">{destination}</span>
        </p>
        {optimalPath.length > 0 ? (
          <div className="mt-4">
            <p className="font-semibold text-lg text-gray-800">
              Best Path (Dijkstra):
            </p>
            <p className="mt-2 text-gray-700">
              {optimalPath.map((city) => (
                <span key={city} className="font-bold">
                  {city} ({graphData[city].state},{" "}
                  {graphData[city].isPrimary ? "Primary" : "Secondary"})
                  {city !== optimalPath[optimalPath.length - 1] && " → "}
                </span>
              ))}
            </p>
            <div className="mt-4 space-y-1">
              <p className="font-semibold text-gray-800">
                Total Cost:{" "}
                <span className="text-indigo-600">{totalCost}</span>
              </p>
              <p className="font-semibold text-gray-800">
                Total Distance:{" "}
                <span className="text-indigo-600">{totalDistance}</span>
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-4 text-red-500 font-bold">
            No path found. (Possibly too many nodes disabled.)
          </div>
        )}
        <div className="mt-6">
          <h3 className="font-semibold text-lg text-gray-800">Disabled Nodes</h3>
          {disabledNodes.length > 0 ? (
            <ul className="mt-2 space-y-2">
              {disabledNodes.map((node) => (
                <li
                  key={node}
                  className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-md"
                >
                  <span className="text-gray-700 font-bold">
                    {node} ({graphData[node].state},{" "}
                    {graphData[node].isPrimary ? "Primary" : "Secondary"})
                  </span>
                  <Button color="success" onClick={() => handleEnableNode(node)}>
                    Enable
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-gray-500">No nodes disabled.</p>
          )}
        </div>
      </div>

      {/* Modal for Node Details */}
      <Modal show={showNodeModal} onClose={() => setShowNodeModal(false)}>
        <Modal.Header className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold">
          Node Details: {selectedNode?.name}
        </Modal.Header>
        <Modal.Body>
          {selectedNode && (
            <div className="space-y-3">
              <p>
                <strong className="text-gray-800">State:</strong>{" "}
                {selectedNode.state}
              </p>
              <p>
                <strong className="text-gray-800">Type:</strong>{" "}
                {selectedNode.isPrimary ? "Primary" : "Secondary"}
              </p>
              <p>
                <strong className="text-gray-800">
                  Weather (to first neighbor):
                </strong>{" "}
                {selectedNode.weather}
              </p>
              <p>
                <strong className="text-gray-800">
                  Load (to first neighbor):
                </strong>{" "}
                {selectedNode.load}
              </p>
              <p>
                <strong className="text-gray-800">
                  Mode (to first neighbor):
                </strong>{" "}
                {selectedNode.mode}
              </p>
              <p>
                <strong className="text-gray-800">
                  Distance (to first neighbor):
                </strong>{" "}
                {selectedNode.distance}
              </p>
              <p>
                <strong className="text-gray-800">
                  Cost (to first neighbor):
                </strong>{" "}
                {selectedNode.cost}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {selectedNode &&
            (disabledNodes.includes(selectedNode.name) ? (
              <Button color="success" onClick={() => handleEnableNode(selectedNode.name)}>
                Enable Node
              </Button>
            ) : (
              <Button color="failure" onClick={() => handleDisableNode(selectedNode.name)}>
                Disable Node
              </Button>
            ))} 
          <Button color="gray" onClick={() => setShowNodeModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
