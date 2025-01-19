const express = require("express");
const router = express();

//importing signUp function from controller
const { createRoom, getRooms } = require("../controllers/roomController");
const multerConfig = require("../config/multerConfig");
const uploadImages = require("../middlewares/cloudinaryUpload");
const { verifyAccessJWT } = require("../middlewares/jwtVerification");

//the post request for signup
router
  .route("/createroom")
  .post(verifyAccessJWT, multerConfig, uploadImages, createRoom);
router.route("/getrooms").get(getRooms);

module.exports = router;
