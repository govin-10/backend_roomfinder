const express = require("express");
const router = express();

//importing signUp function from controller
const {
  recommendRooms,
} = require("../controllers/recommend/recommendController");
const { verifyAccessJWT } = require("../middlewares/jwtVerification");

//the post request for signup
router.route("/rooms").post(verifyAccessJWT, recommendRooms);
// router.route("/getrooms").get(getRooms);

module.exports = router;
