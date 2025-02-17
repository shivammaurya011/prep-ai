import mongoose from "mongoose";

const InterviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    topic: {
      type: String,
      required: true,
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
        validator: function (v) {
          return v > new Date();
        },
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

InterviewSchema.pre("save", function (next) {
  const now = new Date();
  const interviewDate = new Date(this.date);

  if (interviewDate <= now && this.status === "upcoming") {
    this.status = "ongoing";
  }
  if (interviewDate < now - 1 * 60 * 60 * 1000 && this.status === "ongoing") {
    this.status = "completed";
  }
  next();
});

InterviewSchema.statics.updateStatuses = async function () {
  const now = new Date();

  // Update status to ongoing
  await this.updateMany(
    { status: "upcoming", date: { $lte: now } },
    { status: "ongoing" }
  );

  // Update status to completed if interview is older than 1 hour
  await this.updateMany(
    { status: "ongoing", date: { $lt: now - 1 * 60 * 60 * 1000 } },
    { status: "completed" }
  );

  // Update status to missed if interview is in the past
  await this.updateMany(
    { status: "upcoming", date: { $lt: now } },
    { status: "missed" }
  );
};

export default mongoose.models.Interview || mongoose.model("Interview", InterviewSchema);
