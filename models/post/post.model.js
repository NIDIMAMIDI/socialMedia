import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  image: {
    type: String,
    required: false
  },
  video: {
    type: String,
    required: false
  },
  caption: {
    type: String,
    required: false
  },
  likes: {
    type: Number,
    default: 0
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

export const Post = mongoose.model('Post', postSchema);
