import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  parcelId: { type: String, ref: "Parcel", required: true },
  message: { type: String, required: true },
  status: {
    type: String,
    enum: ["Accepted", "Pending", "Dispatched", "Finished"],
    default: "Pending",
  },
  timestamp: { type: Date, default: Date.now },
  node: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Node", // References Node model
    required: true,
  },
}, { timestamps: true });

const Notification = mongoose.model("Notification", NotificationSchema);
export default Notification;
