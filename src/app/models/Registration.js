import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
  registrationDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['REGISTERED', 'WAITLISTED', 'CANCELED'], default: 'REGISTERED' },
});

export default mongoose.models.Registration || mongoose.model('Registration', registrationSchema);