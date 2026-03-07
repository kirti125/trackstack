const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const { createIssue, getProjectIssues, updateIssue, assignIssue, changeStatus, deleteIssue } = require("../controllers/issueController");

router.post("/", protect, createIssue);
router.get("/", protect, getProjectIssues);
router.put("/:id", protect, updateIssue);
router.put("/:id/assign", protect, assignIssue);
router.put("/:id/status", protect, changeStatus);
router.delete("/:id", protect, deleteIssue);
module.exports = router;