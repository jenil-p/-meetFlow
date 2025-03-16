import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String },
  githubId: { type: String },
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER', required: true },
  affiliation: { type: String }, // to be added...
  contactDetails: { type: String },// to be added...
  areasOfInterest: { type: String },// to be added...
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model('User', userSchema);