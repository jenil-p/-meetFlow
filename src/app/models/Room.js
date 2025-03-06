import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true },
  capacity: { type: Number, required: true },
  location: { type: String },
});

export default mongoose.models.Room || mongoose.model('Room', roomSchema);