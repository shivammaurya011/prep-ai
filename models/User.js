import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, required: true, trim: true },
    emailVerified: { type: Date },
    password: { type: String, required: true },
    image: { type: String, trim: true },
    interviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Interview" }],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
