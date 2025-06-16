const Trip = require("../models/Trip");
const { findAvailableDriver, assignDriverToTrip } = require("../utils/matchDriver"); // Import matching functions

// Create trip
exports.createTrip = async (req, res) => {
  try {
    const trip = new Trip(req.body);
    await trip.save();

    const matchedDriverId = await findAvailableDriver(trip);

    if (matchedDriverId) {
      const updatedTrip = await assignDriverToTrip(trip._id, matchedDriverId);
      if (updatedTrip) {
        return res.status(201).json({ message: "Trip created and driver assigned", trip: updatedTrip });
      } else {
        return res.status(500).json({ error: "Failed to assign driver after finding one." });
      }
    } else {
      return res.status(201).json({ message: "Trip created, searching for driver...", trip });
    }
  } catch (err) {
    console.error("Error creating trip:", err);
    res.status(500).json({ error: "Failed to create trip" });
  }
};

// Update trip status
exports.updateTripStatus = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { status } = req.body;
    const trip = await Trip.findByIdAndUpdate(tripId, { status }, { new: true });
    if (!trip) return res.status(404).json({ error: "Trip not found" });
    res.status(200).json({ message: "Status updated", trip });
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
};

// Cancel trip
exports.cancelTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { reason } = req.body;
    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ error: "Trip not found" });
    if (["completed", "cancelled"].includes(trip.status))
      return res.status(400).json({ error: `Cannot cancel a ${trip.status} trip` });

    trip.status = "cancelled";
    trip.cancelReason = reason || "No reason provided";
    await trip.save();
    res.status(200).json({ message: "Trip cancelled", trip });
  } catch (err) {
    res.status(500).json({ error: "Cancel failed" });
  }
};

// Reschedule trip
exports.rescheduleTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const updates = req.body;
    const oldTrip = await Trip.findById(tripId);
    if (!oldTrip) return res.status(404).json({ error: "Original trip not found" });

    oldTrip.status = "rescheduled";
    await oldTrip.save();

    const newTrip = new Trip({
      ...updates,
      riderId: oldTrip.riderId,
      tripType: oldTrip.tripType,
    });
    const savedNewTrip = await newTrip.save();

    oldTrip.rescheduledTripId = savedNewTrip._id;
    await oldTrip.save();

    res.status(201).json({ message: "Trip rescheduled", newTrip: savedNewTrip });
  } catch (err) {
    res.status(500).json({ error: "Reschedule failed" });
  }
};

// Get real-time tracking
exports.getTripTracking = async (req, res) => {
  try {
    const { tripId } = req.params;
    const trip = await Trip.findById(tripId).select("realTimeTracking");
    if (!trip) return res.status(404).json({ error: "Trip not found" });
    res.status(200).json({ tracking: trip.realTimeTracking });
  } catch (err) {
    res.status(500).json({ error: "Tracking fetch failed" });
  }
};
