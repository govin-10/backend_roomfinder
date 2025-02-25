const express = require("express");
const router = express();

//importing signUp function from controller
const {
  createRoom,
  getRooms,
  getRoomById,
} = require("../controllers/rooms/roomController");
const multerConfig = require("../config/multerConfig");
const uploadImages = require("../middlewares/cloudinaryUpload");
const { verifyAccessJWT } = require("../middlewares/jwtVerification");
const { searchRooms, nearbyRooms } = require("../controllers/rooms/searchRoom");

//the post request for signup
router
  .route("/createroom")
  .post(verifyAccessJWT, multerConfig, uploadImages, createRoom);
router.route("/getrooms").get(verifyAccessJWT, getRooms);
router.route("/get-room-details/:r_id").get(verifyAccessJWT, getRoomById);
router.route("/search/:query").get(verifyAccessJWT, searchRooms);
router.route("/nearby/:radius").get(verifyAccessJWT, nearbyRooms);

module.exports = router;
