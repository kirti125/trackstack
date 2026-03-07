const Issue = require("../models/Issue");
const Project = require("../models/Project");
const asyncHandler = require("../middleware/asyncHandler");
const Activity = require("../models/Activity");

// CREATE ISSUE
exports.createIssue = asyncHandler(async (req, res) => {
  const { title, description, projectId, priority } = req.body;

  if (!title || !projectId) {
    res.status(400);
    throw new Error("Title and projectId required");
  }

  const project = await Project.findById(projectId);

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  if (!project.members.includes(req.user.id)) {
    res.status(403);
    throw new Error("Not a project member");
  }

  // ✅ Create Issue
  const issue = await Issue.create({
    title,
    description,
    projectId,
    priority,
    createdBy: req.user.id,
  });

  // ✅ Create Activity Log
  await Activity.create({
    issueId: issue._id,
    userId: req.user.id,
    actionType: "ISSUE_CREATED",
    previousValue: null,
    newValue: title,
  });

  res.status(201).json({
    success: true,
    data: issue,
  });
});


exports.getProjectIssues = asyncHandler(async (req, res) => {
  const { projectId, page = 1, limit = 10, status, priority } = req.query;

  if (!projectId) {
    res.status(400);
    throw new Error("projectId is required");
  }

  const project = await Project.findById(projectId);

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  if (!project.members.includes(req.user.id)) {
    res.status(403);
    throw new Error("Not authorized");
  }

  const filter = { projectId };

  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  const skip = (page - 1) * limit;

  const issues = await Issue.find(filter)
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await Issue.countDocuments(filter);

  res.json({
    success: true,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
    data: issues,
  });
});

exports.updateIssue = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.id);

  if (!issue) {
    res.status(404);
    throw new Error("Issue not found");
  }

  const project = await Project.findById(issue.projectId);

  const isOwner = project.owner.toString() === req.user.id;
  const isAssigned =
    issue.assignedTo &&
    issue.assignedTo.toString() === req.user.id;

  if (!isOwner && !isAssigned) {
    res.status(403);
    throw new Error("Not authorized to update");
  }

  const { title, description, priority } = req.body;

  if (title) issue.title = title;
  if (description) issue.description = description;
  if (priority) issue.priority = priority;

  await issue.save();

  res.json({
    success: true,
    data: issue,
  });
});

exports.assignIssue = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  const issue = await Issue.findById(req.params.id);
  const oldAssigned = issue.assignedTo
  ? issue.assignedTo.toString()
  : null;

  if (!issue) {
    res.status(404);
    throw new Error("Issue not found");
  }

  const project = await Project.findById(issue.projectId);

  if (project.owner.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Only owner can assign issues");
  }

  if (!project.members.includes(userId)) {
    res.status(400);
    throw new Error("User is not a project member");
  }

  issue.assignedTo = userId;
  await issue.save();
  await Activity.create({
    issueId: issue._id,
    userId: req.user.id,
    actionType: "ASSIGNED_CHANGED",
    previousValue: oldAssigned,
    newValue: userId,
  });

  res.json({
    success: true,
    data: issue,
  });
});

exports.changeStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const oldStatus = issue.status;

  const issue = await Issue.findById(req.params.id);

  if (!issue) {
    res.status(404);
    throw new Error("Issue not found");
  }

  const allowedTransitions = {
    ToDo: "InProgress",
    InProgress: "Done",
    Done: null,
  };

  if (allowedTransitions[issue.status] !== status) {
    res.status(400);
    throw new Error("Invalid status transition");
  }

  issue.status = status;
  await issue.save();
  await Activity.create({
    issueId: issue._id,
    userId: req.user.id,
    actionType: "STATUS_CHANGED",
    previousValue: oldStatus,
    newValue: status,
  });

  res.json({
    success: true,
    data: issue,
  });
});

exports.deleteIssue = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.id);

  if (!issue) {
    res.status(404);
    throw new Error("Issue not found");
  }

  const project = await Project.findById(issue.projectId);

  if (
    project.owner.toString() !== req.user.id &&
    issue.createdBy.toString() !== req.user.id
  ) {
    res.status(403);
    throw new Error("Not authorized to delete this issue");
  }

  await issue.deleteOne();

  res.json({
    success: true,
    message: "Issue deleted successfully",
  });
});