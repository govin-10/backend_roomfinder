const express = require("express");

const app = express();

//regular middlewares
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" })); //This will make us able to get data from the url.

//entry point
app.get("/api", (req, res) => {
  res.send("Welcome to Room Finder API");
});

//importing routes
const userRoutes = require("./routes/userRoute");
const otpRoutes = require("./routes/otpRoute");
const roomRoutes = require("./routes/roomRoute")

app.use("/users", userRoutes);
app.use("/otp", otpRoutes);
app.use("/rooms", roomRoutes);

module.exports = app;
