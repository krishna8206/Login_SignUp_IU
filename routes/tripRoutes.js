const express = require("express");
const router = express.Router();
const tripController = require("../controllers/tripController");

router.post("/", tripController.createTrip);
router.patch("/:tripId/status", tripController.updateTripStatus);
router.post("/:tripId/cancel", tripController.cancelTrip);
router.post("/:tripId/reschedule", tripController.rescheduleTrip);
router.get("/:tripId/tracking", tripController.getTripTracking);

module.exports = router;
