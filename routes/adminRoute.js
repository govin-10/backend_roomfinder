const express = require("express");
const router = express.Router();
const { verifyAccessJWT } = require("../middlewares/jwtVerification");
const {
  getPendingRooms,
  approveRoom,
  rejectRoom,
  deleteRoom,
  getAllRooms,
  getFlats,
  getRooms,
  roomKpis,
} = require("../controllers/admin/adminController-room");
const {
  userKpis,
  blockUser,
  getHomeOwners,
  getRenters,
  getAllUsers,
} = require("../controllers/admin/adminController-users");
const { allBookings } = require("../controllers/admin/adminController-booking");

router.get("/get-all-rooms", verifyAccessJWT, getAllRooms);
router.get("/get-pending-rooms", verifyAccessJWT, getPendingRooms);
router.patch("/approve-room/:room_id", verifyAccessJWT, approveRoom);
router.patch("/reject-room/:room_id", verifyAccessJWT, rejectRoom);
router.delete("/delete-room/:room_id", verifyAccessJWT, deleteRoom);
router.get("/users/stats", verifyAccessJWT, userKpis);
router.patch("/users/block/:u_id", verifyAccessJWT, blockUser);
router.get("/filter-rooms", verifyAccessJWT, getRooms);
router.get("/filter-flats", verifyAccessJWT, getFlats);
router.get("/all-bookings", verifyAccessJWT, allBookings);
router.get("/roomkpis", verifyAccessJWT, roomKpis);
router.get("/getallusers", verifyAccessJWT, getAllUsers);
router.get("/gethomeOwners", verifyAccessJWT, getHomeOwners);
router.get("/getrenters", verifyAccessJWT, getRenters);
// router.get("/all-bookings", verifyAccessJWT, allBookings);

module.exports = router;
