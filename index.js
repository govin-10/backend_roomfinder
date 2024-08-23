const express = require("express");
const { sqlConnection } = require("./config/dbConfig");

const app = express();

//environment variable access
const PORT_NUMBER = process.env.PORT_NUMBER || 3000;

//regular middlewares
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" })); //This will make us able to get data from the url.

//connection creation to the database
sqlConnection.connect((err) => {
  if (err) {
    console.log("Error connecting to the database", err.message);
  } else {
    console.log("Database connected successfully");
  }
});

//entry point
app.get("/", (req, res) => {
  res.send("Welcome to Room Finder API");
});

//initiating the server
app.listen(PORT_NUMBER, () => {
  console.log(`Server is running on port ${PORT_NUMBER}`);
});
