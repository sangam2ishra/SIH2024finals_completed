import mongoose from "mongoose";

const NodeSchema = new mongoose.Schema({
  nodeCategory: {
    type: Number,
    required: true,
    default: 2,
  },
  name: {
    type: String,
    required: true,
    unique: true, // Ensures the 'name' is unique across the collection
  }, // Name of the hub
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  // transportationModes: {
  //   train: [
  //     {
  //       number: { type: String, required: true },
  //       departureTime: { type: Date, required: true },
  //       arrivalTime: { type: Date, required: true },
  //     }
  //   ],
  //   bus: [
  //     {
  //       number: { type: String, required: true },
  //       departureTime: { type: Date, required: true },
  //       arrivalTime: { type: Date, required: true },
  //     }
  //   ],
  //   ship: [
  //     {
  //       number: { type: String, required: true },
  //       departureTime: { type: Date, required: true },
  //       arrivalTime: { type: Date, required: true },
  //     }
  //   ],
  //   air: [
  //     {
  //       number: { type: String, required: true },
  //       departureTime: { type: Date, required: true },
  //       arrivalTime: { type: Date, required: true },
  //     }
  //   ],
  // },
  storageCapacity: {
    type: Number,
    required: true,
  }, // Max storage capacity
  currentLoad: {
    type: Number,
    default: 0,
  }, // Current used capacity
  postOffices: [{ type: String }],
  weatherConditions: {
    type: String,
    enum: ["Good", "Moderate", "Severe","Clear","Cloudy"],
    default: "Good",
  },
  Alert: {
    type: String,
    default: "No Alert",
  },
  L1Connections: [{ type: String }], // Links to other Level 1 hubs
  L2Connections: [{ type: String }], // Linked Level 2 nodes
  notifications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notification", // References Notification model
    },
  ],
  sortingClosingTime: {
    type: String, // Example: '22:00' for 10 PM in 24-hour format
    default: "8:00",
  },
}, { timestamps: true });

const Node = mongoose.model("Node", NodeSchema);
export default Node;
