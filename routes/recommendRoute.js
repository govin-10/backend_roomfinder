const express = require("express");
const router = express();

const {
  recommendRooms,
  savePreference,
  getPreference,
} = require("../controllers/recommend/recommendController");
const { verifyAccessJWT } = require("../middlewares/jwtVerification");

router.route("/rooms").post(verifyAccessJWT, recommendRooms);
router.route("/set-preferences").post(verifyAccessJWT, savePreference);
router.route("/get-preferences").get(verifyAccessJWT, getPreference);

module.exports = router;
