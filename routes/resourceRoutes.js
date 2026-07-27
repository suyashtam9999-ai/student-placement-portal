const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
  getResources,
  createResource,
  deleteResource,
  toggleResourceComplete,
} = require("../controllers/resourceController");

router.get("/", protect, getResources);
router.post("/", protect, adminOnly, createResource);
router.delete("/:id", protect, adminOnly, deleteResource);
router.put("/:id/complete", protect, toggleResourceComplete);

module.exports = router;
