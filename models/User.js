import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  emailVerified: Date,
  password: String,
  image: String,
  interviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Interview' }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model('User', userSchema);