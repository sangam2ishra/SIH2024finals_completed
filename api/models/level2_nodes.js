import mongoose from "mongoose";
const Level2NodeSchema = new mongoose.Schema({
    nodeId: { type: String, required: true, unique: true }, // Unique ID for the city hub
    name: { type: String, required: true }, // Name of the city hub
    level1Link: { type: String, ref: "level1_nodes", required: true }, // Connected Level 1 hub
    location: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },
    postOffices: [{ type: String }], // Array of Level 2 post offices served by this hub
    transportationModes: { 
        type: [String], 
        enum: ["Train", "Truck","Ship","Flight"], 
        required: true 
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
        // enum: ["Good", "Moderate", "Severe"],
        default: "Good",
      },
    Alert: {
        type: String,
        // enum: ["Good", "Moderate", "Severe"],
        default: "No Alert",
      },
      notifications: [
        {
          notificationId: { type: String, ref: "Notification" }, // Reference to the Notification schema
          parcelId: { type: String, required: true }, // Parcel associated with the notification
          message: { type: String, required: true }, // Message content
          status: { 
            type: String, 
            enum: ["Sent", "Pending"], 
            default: "Pending" 
          },
          timestamp: { type: Date, default: Date.now },
        }
      ],

}, { timestamps: true });

// module.exports = mongoose.model("Level2Node", Level2NodeSchema);

const Level2Node=mongoose.model('Level2Node',Level2NodeSchema);
export default Level2Node;
