import express from "express";
import Node from "../models/NodeModel.js";

const router = express.Router();

/**
 * Route to create one or multiple nodes
 * @route POST /api/createNodes
 * @param {Object} req - The request object containing Node details
 * @param {Object} res - The response object
 */
router.post("/createNodes", async (req, res) => {
  try {
    const nodes = Array.isArray(req.body) ? req.body : [req.body]; // Check if body is an array, else make it an array with a single node

    const createdNodes = [];

    // Loop through each node in the array (even if it's just one node)
    for (const nodeData of nodes) {
      const {
        nodeCategory,
        name,
        location,
        transportationModes,
        storageCapacity,
        currentLoad,
        weatherConditions,
        L1Connections,
        L2Connections,
      } = nodeData;

      // Validate required fields for each node
      if (
        !nodeCategory ||
        !name ||
        !location?.latitude ||
        !location?.longitude ||
        !transportationModes ||
        !storageCapacity
      ) {
        return res.status(400).json({ message: "Missing required fields for one of the nodes." });
      }

      // Check if a node with the same name already exists
      const existingNode = await Node.findOne({ name });
      if (existingNode) {
        return res.status(400).json({ message: `Node name ${name} must be unique.` });
      }

      // Create a new Node using the provided schema
      const newNode = new Node({
        nodeCategory,
        name,
        location,
        transportationModes,
        storageCapacity,
        currentLoad: currentLoad || 0, // Default to 0 if not provided
        weatherConditions: weatherConditions || "Good", // Default to "Good" if not provided
        L1Connections: L1Connections || [], // Default to an empty array if not provided
        L2Connections: L2Connections || [], // Default to an empty array if not provided
      });

      // Save the Node to the database
      const savedNode = await newNode.save();
      createdNodes.push(savedNode);
    }

    // Return the created nodes as a response
    return res.status(201).json({
      message: "Nodes created successfully.",
      nodes: createdNodes,
    });
  } catch (error) {
    console.error("Error creating nodes:", error);
    return res.status(500).json({ message: "Server error." });
  }
});

router.post("/addTransport", async (req, res) => {
  console.log("Rec");
  try {
    const { selectedMode, name, transportationModes } = req.body;
    console.log(req.body);
    
    // Validate input
    if (!selectedMode || !name) {
      return res.status(400).json({ 
        message: "Mode and node name are required" 
      });
    }

    // Find the existing node
    const existingNode = await Node.findOne({ name });

    // // If node doesn't exist, create a new one
    // if (!existingNode) {
    //   return res.status(404).json({ 
    //     message: "Node not found" 
    //   });
    // }

    // Prepare the new transportation mode entry
    const newTransportEntry = {
      number: transportationModes.number,
      departureTime: transportationModes.departureTime,
      arrivalTime: transportationModes.arrivalTime
    };
    console.log(newTransportEntry);

    // Update the specific transportation mode array
    switch(selectedMode.toLowerCase()) {
      case 'train':
        existingNode.transportationModes.train.push(newTransportEntry);
        break;
      case 'bus':
        existingNode.transportationModes.bus.push(newTransportEntry);
        break;
      case 'ship':
        existingNode.transportationModes.ship.push(newTransportEntry);
        break;
      case 'air':
        existingNode.transportationModes.air.push(newTransportEntry);
        break;
      default:
        return res.status(400).json({ 
          message: "Invalid transportation mode" 
        });
    }

    // Save the updated node
    const updatedNode = await existingNode.save();
    console.log(updatedNode);

    // Respond with success and updated node
    res.status(200).json({
      message: "Transportation mode added successfully",
      node: updatedNode
    });

  } catch (error) {
    console.error("Error adding transport:", error);
    res.status(500).json({ 
      message: "Internal server error", 
      error: error.message 
    });
  }
});

export default router;
