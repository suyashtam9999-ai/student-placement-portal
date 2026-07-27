const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();

const { connectDB } = require("./config/db");

// Load all models so their associations register before sequelize.sync() runs
require("./models/User");
require("./models/Resource");
require("./models/Question");
require("./models/TestResult");
require("./models/CompletedResource");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));
app.use("/api/resources", require("./routes/resourceRoutes"));
app.use("/api/tests", require("./routes/testRoutes"));

// Serve frontend static files
app.use(express.static(path.join(__dirname, "public")));

// Fallback to index.html for the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
