const express = require("express");
const router = express();

//importing signUp function from controller
const { requestOTP, verifyOTP } = require("../controllers/otpController");

//the post request for signup
router.route("/requestOTP").post(requestOTP);
router.route("/verifyOTP").patch(verifyOTP);

module.exports = router;
