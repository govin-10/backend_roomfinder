const express = require("express");
const router = express();

//importing signUp function from controller
const {
  signUpUser,
  loginUser,
  getUserById,
} = require("../controllers/userController");
const { addPaymentInfo } = require("../controllers/paymentController");

//the post request for signup
router.route("/signup").post(signUpUser);
router.route("/login").post(loginUser);
router.route("/getuserbyid").get(getUserById);
router.route("/addpayment").post(addPaymentInfo);

module.exports = router;
