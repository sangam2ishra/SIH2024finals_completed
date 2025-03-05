import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  busNo: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  }, 
  source: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  }
},{
  timestamps: true
});

const Booking=mongoose.model('Booking',bookingSchema);

export default Booking;
