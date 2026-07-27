const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getProfile, updateProfile, getDashboardStats } = require("../controllers/profileController");

router.get("/me", protect, getProfile);
router.put("/me", protect, updateProfile);
router.get("/dashboard", protect, getDashboardStats);

module.exports = router;
