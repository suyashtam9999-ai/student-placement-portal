const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getQuestions, submitTest, getHistory } = require("../controllers/testController");

router.get("/questions", protect, getQuestions);
router.post("/submit", protect, submitTest);
router.get("/history", protect, getHistory);

module.exports = router;
