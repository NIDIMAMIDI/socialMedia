import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
  commentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reply: {
    type: String,
    required: true,
    trim: true
  },
  likes: {
    type: Number,
    default: 0,
    min: 0
  },
  date: {
    type: Date,
    default: Date.now
  }
});

export const Reply = mongoose.model('Reply', replySchema);
