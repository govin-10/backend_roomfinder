const express = require("express");
const router = express();

//importing signUp function from controller
const { signUpUser, loginUser } = require("../controllers/userController");

//the post request for signup
router.route("/signup").post(signUpUser);
router.route("/login").post(loginUser);

module.exports = router;
