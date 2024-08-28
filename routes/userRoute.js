const express = require("express");
const router = express();

//importing signUp function from controller
const { signUpUser } = require("../controllers/userController");

//the post request for signup
router.route("/signup").post(signUpUser);

module.exports = router;
