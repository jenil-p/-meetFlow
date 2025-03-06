import mongoose from 'mongoose';

const paperSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  abstract: { type: String, required: true },
  preferredTime: { type: Date },
  fileUrl: { type: String },
  status: { type: String, enum: ['SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'], default: 'SUBMITTED' },
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' }, // If approved, linked to a session
  submittedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Paper || mongoose.model('Paper', paperSchema);