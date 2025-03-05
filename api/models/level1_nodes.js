const mongoose = require("mongoose");

const Level1NodeSchema = new mongoose.Schema({
    nodeId: { type: String, required: true, unique: true }, // Unique ID for the hub
    name: { type: String, required: true }, // Name of the hub
    location: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },
    transportationModes: {
        type: [String],
        enum: ["Flight", "Ship", "Train", "Truck"],
        // required: true
    },
    storageCapacity: {
        type: Number,
        required: true
    }, // Max storage capacity
    currentLoad: {
        type: Number,
        default: 0
    }, // Current used capacity
    weatherConditions: {
        type: String,
        enum: ["Good", "Moderate", "Severe"],
        default: "Good"
    },
    connectedNodes: [{ type: String, ref: "level1_nodes" }], // Links to other Level 1 hubs
    linkedCityHubs: [{ type: String, ref: "level2_nodes" }] // Linked Level 2 nodes
}, { timestamps: true });

module.exports = mongoose.model("Level1Node", Level1NodeSchema);