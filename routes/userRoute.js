const express = require("express");
const router = express();

//importing signUp function from controller
const {
  signUpUser,
  loginUser,
  getUserById,
} = require("../controllers/userController");
const { addPaymentInfo } = require("../controllers/paymentController");
const {
  verifyAccessJWT,
  verifyRefreshJWT,
} = require("../middlewares/jwtVerification");
const { refreshAccessToken } = require("../controllers/auth/tokens");

//the post request for signup
router.route("/signup").post(signUpUser);
router.route("/login").post(loginUser);
router.route("/getuserbyid").get(verifyAccessJWT, getUserById);
router.route("/refresh-token").post(verifyRefreshJWT, refreshAccessToken);
router.route("/addpayment").post(addPaymentInfo);

module.exports = router;
