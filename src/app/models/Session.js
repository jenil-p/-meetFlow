import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  conference: { type: mongoose.Schema.Types.ObjectId, ref: 'Conference', required: true },
  title: { type: String, required: true },
  description: { type: String },
  sessionType: { type: String, enum: ['WORKSHOP', 'PRESENTATION', 'KEYNOTE'], required: true },
  speaker: { type: String },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resources: [
    {
      resource: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource' },
      quantity: { type: Number, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Session || mongoose.model('Session', sessionSchema);