const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  riderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  pickupLocation: {
    address: String,
    lat: Number,
    lng: Number,
  },
  dropLocation: {
    address: String,
    lat: Number,
    lng: Number,
  },
  tripType: {
    type: String,
    enum: ["bike", "auto", "cab", "cargo"],
    default: "bike",
  },
  status: {
    type: String,
    enum: ["requested", "accepted", "ongoing", "completed", "cancelled", "rescheduled"],
    default: "requested",
  },
  cancelReason: String,
  rescheduledTripId: { type: mongoose.Schema.Types.ObjectId, ref: "Trip" },
  realTimeTracking: [
    {
      lat: Number,
      lng: Number,
      timestamp: { type: Date, default: Date.now },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("Trip", tripSchema);
