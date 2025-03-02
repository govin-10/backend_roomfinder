const express = require("express");

const app = express();
app.use(express.static("public"));

const swaggerUi = require("swagger-ui-express");

const swaggerUrl =
  "https://backend-roomfinder-api.onrender.com" ||
  "http://localhost:3000/" + "swagger.yaml";

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
const roomRoutes = require("./routes/roomRoute");
const recommendRoutes = require("./routes/recommendRoute");
const bookingRoutes = require("./routes/bookingRoute");
const adminRoutes = require("./routes/adminRoute");

app.use("/users", userRoutes);
app.use("/otp", otpRoutes);
app.use("/rooms", roomRoutes);
app.use("/recommend", recommendRoutes);
app.use("/bookings", bookingRoutes);
app.use("/admin", adminRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(null, { swaggerUrl }));

module.exports = app;
