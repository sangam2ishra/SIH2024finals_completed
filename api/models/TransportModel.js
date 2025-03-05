import mongoose from "mongoose";

const TransportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  journey: {
    source: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
  },
  mode: {
    type: String,
    enum: ["Truck", "Train", "Flight", "Ship"],
    // required: true,
  },
});

const Transport=mongoose.model("Transport", TransportSchema);
export default Transport;