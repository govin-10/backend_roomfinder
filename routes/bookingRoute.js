const express = require("express");
const router = express.Router();
const { verifyAccessJWT } = require("../middlewares/jwtVerification");
const {
  requestBooking,
  acceptBooking,
  deleteBookingRequest,
  getBookingRequests,
  getRentersRequests,
} = require("../controllers/bookings/bookingController");

router.post("/request-booking", verifyAccessJWT, requestBooking);
router.post("/accept-booking", verifyAccessJWT, acceptBooking);
router.delete("/delete-booking", verifyAccessJWT, deleteBookingRequest);
router.get("/get-booking-requests", verifyAccessJWT, getBookingRequests);
router.get("/get-my-requests", verifyAccessJWT, getRentersRequests);

module.exports = router;
