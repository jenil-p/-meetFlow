import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // For email/password login (hashed)
  googleId: { type: String }, // For Google login
  githubId: { type: String }, // For GitHub login
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER', required: true },
  affiliation: { type: String },
  contactDetails: { type: String },
  areasOfInterest: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model('User', userSchema);