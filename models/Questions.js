import mongoose from "mongoose";

const QuestionsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    interview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
      required: true,
      index: true,
    },
    questions: [
        {
            question: { type: String, required: true, trim: true },
            answer: { type: String, required: true, trim: true },
            score: { type: Number, required: true, min: 0, max: 10 },
            feedback: { type: String, trim: true },
            followUp: [
                {
                question: { type: String, required: true, trim: true },
                answer: { type: String, required: true, trim: true },
                score: { type: Number, required: true, min: 0, max: 10 },
                feedback: { type: String, trim: true },
                },
            ],
        },
    ],
    report: {
      communication: { score: { type: Number, required: true }, feedback: { type: String, trim: true } },
      bodyLanguage: { score: { type: Number, required: true }, feedback: { type: String, trim: true } },
      confidence: { score: { type: Number, required: true }, feedback: { type: String, trim: true } },
      knowledge: { score: { type: Number, required: true }, feedback: { type: String, trim: true } },
      overall: { score: { type: Number, required: true }, feedback: { type: String, trim: true } },
    },
  },
  { timestamps: true }
);

// Virtual field to calculate total score dynamically
QuestionsSchema.virtual("totalScore").get(function () {
  return this.questions.reduce((sum, q) => sum + q.score, 0);
});

export default mongoose.models.Questions || mongoose.model("Questions", QuestionsSchema);
