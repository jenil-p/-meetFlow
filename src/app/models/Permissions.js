import mongoose from 'mongoose';

const permissionsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
  paperLink: { type: String, required: true },
  title: { type: String, required: true },
  summary: { type: String, required: true },
  expectedPresentationTime: { type: Number, required: true }, // In minutes
  messageToOrganizer: { type: String },
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Permissions || mongoose.model('Permissions', permissionsSchema);