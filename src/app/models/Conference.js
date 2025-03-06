import mongoose from 'mongoose';

const conferenceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  location: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Admin who created the conference
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Conference || mongoose.model('Conference', conferenceSchema);