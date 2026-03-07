const Project = require("../models/Project");

exports.checkProjectMember = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if logged-in user is in members array
    if (!project.members.includes(req.user.id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Attach project to request for next controller
    req.project = project;

    next();

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};