const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  createProject,
  getUserProjects,
  addMember,
  deleteProject,
  getProjectById
} = require("../controllers/projectController");
const { checkProjectMember } = require("../middleware/projectMiddleware");

router.post("/", protect, createProject);
router.get("/", protect, getUserProjects);
router.put("/:id/add-member", protect, addMember);
router.delete("/:id", protect, deleteProject);
router.get("/:id", protect, checkProjectMember, getProjectById);

module.exports = router;