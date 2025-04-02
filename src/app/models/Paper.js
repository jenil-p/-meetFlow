import mongoose from 'mongoose';

const paperSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
  title: { type: String, required: true },
  paperLink: { type: String, required: true }, 
  summary: { type: String, required: true }, 
  status: { type: String, enum: ['UNDER_REVIEW', 'APPROVED', 'REJECTED'], default: 'UNDER_REVIEW' },
});

export default mongoose.models.Paper || mongoose.model('Paper', paperSchema);