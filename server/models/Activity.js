const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    issueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    actionType: {
      type: String,
      enum: [
        "ISSUE_CREATED",
        "STATUS_CHANGED",
        "ASSIGNED_CHANGED",
      ],
      required: true,
    },
    previousValue: {
      type: String,
    },
    newValue: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", activitySchema);