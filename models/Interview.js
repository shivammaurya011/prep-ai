import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  questions: [String],
  answers: [String],
  feedback: String,
  date: { type: Date, default: Date.now }
});

export default mongoose.models.Interview || mongoose.model('Interview', interviewSchema);