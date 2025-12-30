const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

//  Middleware
app.use(cors());
app.use(express.json());

//  Root test route (VERY IMPORTANT)
app.get("/", (req, res) => {
  res.send("Jam API is running 🚀");
});

//  Routes
app.use("/api", require("./routes/auth"));

//  MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });

//  404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

//  Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
