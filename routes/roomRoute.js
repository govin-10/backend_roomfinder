const express = require("express");
const router = express();

//importing signUp function from controller
const { createRoom, getRooms } = require("../controllers/roomController");

//the post request for signup
router.route("/createroom").post(createRoom);
router.route("/getrooms").get(getRooms);

module.exports = router;
