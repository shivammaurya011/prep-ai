import mongoose from "mongoose";

const InterviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    level: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    date: {
      type: Date,
      required: true,
      validate: {
        validator: (v) => v > Date.now(),
        message: "Interview date must be in the future",
      },
    },
    status: {
      type: String,
      enum: ["ongoing", "upcoming", "completed", "missed"],
      default: "upcoming",
    },
  },
  { timestamps: true }
);

// Pre-save hook to update status
InterviewSchema.pre("save", function (next) {
  const now = Date.now();
  const interviewDate = new Date(this.date).getTime();

  if (interviewDate <= now && this.status === "upcoming") {
    this.status = "ongoing";
  }
  if (interviewDate < now - 60 * 60 * 1000 && this.status === "ongoing") {
    this.status = "completed";
  }
  next();
});

// Static method to update all interview statuses efficiently
InterviewSchema.statics.updateStatuses = async function () {
  const now = Date.now();

  await this.updateMany(
    { status: "upcoming", date: { $lte: now } },
    { $set: { status: "ongoing" } }
  );

  await this.updateMany(
    { status: "ongoing", date: { $lt: now - 60 * 60 * 1000 } },
    { $set: { status: "completed" } }
  );

  await this.updateMany(
    { status: "upcoming", date: { $lt: now - 60 * 60 * 1000 } },
    { $set: { status: "missed" } }
  );
};

export default mongoose.models.Interview || mongoose.model("Interview", InterviewSchema);
