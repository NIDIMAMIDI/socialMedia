import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  commentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  },
  replyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reply'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

export const Like = mongoose.model('Like', likeSchema);
