const Project = require("../models/Project");
const asyncHandler = require("../middleware/asyncHandler");

// CREATE PROJECT
exports.createProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Project name is required");
  }

  const project = await Project.create({
    name,
    description,
    owner: req.user.id,
    members: [req.user.id],
  });

  res.status(201).json({
    success: true,
    data: project,
  });
});

// GET USER PROJECTS
exports.getUserProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({
    members: req.user.id,
  });

  res.json({
    success: true,
    data: projects,
  });
});

const User = require("../models/User");


exports.addMember = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  if (project.owner.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Only owner can add members");
  }

  const userToAdd = await User.findOne({ email });

  if (!userToAdd) {
    res.status(404);
    throw new Error("User not found");
  }

  if (project.members.includes(userToAdd._id)) {
    res.status(400);
    throw new Error("User already a member");
  }

  project.members.push(userToAdd._id);
  await project.save();

  res.json({
    success: true,
    data: project,
  });
});

exports.deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  // Only owner can delete
  if (project.owner.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Only owner can delete project");
  }

  await project.deleteOne();

  res.json({
    success: true,
    message: "Project deleted successfully",
  });
});

exports.getProjectById = asyncHandler(async (req, res) => {
  if (!req.project) {
    res.status(404);
    throw new Error("Project not found");
  }

  res.json({
    success: true,
    data: req.project,
  });
});