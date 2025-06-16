const User = require("../models/User"); 
const Trip = require("../models/Trip"); 

/**

 * @param {object} tripDetails 
 * @returns {Promise<string|null>} 
 */
exports.findAvailableDriver = async (tripDetails) => {
  try {
    const { pickupLocation, tripType } = tripDetails;

  
    const availableDriver = await User.findOne({
      
      role: "driver",
      isAvailable: true,
      
    });

    if (availableDriver) {
      console.log(`Matched driver: ${availableDriver._id}`);
      return availableDriver._id;
    } else {
      console.log("No available drivers found.");
      return null;
    }
  } catch (error) {
    console.error("Error finding available driver:", error);
    return null;
  }
};

/**
 * @param {string} tripId 
 * @param {string} driverId 
 * @returns {Promise<object|null>} 
 */
exports.assignDriverToTrip = async (tripId, driverId) => {
  try {
    const trip = await Trip.findByIdAndUpdate(
      tripId,
      {
        driverId: driverId,
        status: "accepted", 
      },
      { new: true }
    );
    return trip;
  } catch (error) {
    console.error("Error assigning driver to trip:", error);
    return null;
  }
};
