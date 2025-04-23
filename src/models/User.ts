import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  habits: [{
    id: String,
    name: String,
    description: String,
    frequency: String,
    streak: Number,
    category: String,
    completedDates: [String],
    createdAt: String,
    updatedAt: String
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.User || mongoose.model('User', userSchema); 