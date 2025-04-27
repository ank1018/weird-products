import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema({
  id: String,
  name: String,
  description: String,
  frequency: String,
  streak: Number,
  category: String,
  completedDates: [Date], // or [String] depending on your original schema
  type: String, // Add this line
  createdAt: Date,
  updatedAt: Date
});

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
  habits: [habitSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.User || mongoose.model('User', userSchema); 