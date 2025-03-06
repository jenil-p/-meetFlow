import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  totalQuantity: { type: Number, required: true },
});

export default mongoose.models.Resource || mongoose.model('Resource', resourceSchema);