import { Comment } from '../../models/comment/comment.model.js';
import { Like } from '../../models/like/like.model.js';
import { Reply } from '../../models/reply/reply.model.js';
import { User } from '../../models/user/user.model.js';

export const commentReply = async (req, res, next) => {
  try {
    const { commentId, userId, reply } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: 'failure',
        message: 'User not found.'
      });
    }

    // Check if the comment exists
    const commentDetails = await Comment.findById(commentId).populate(
      'userId',
      'username'
    );
    if (!commentDetails) {
      return res.status(404).json({
        status: 'failure',
        message: 'Comment not found.'
      });
    }

    // Create the reply
    const replyDetails = await Reply.create({ reply, userId, commentId });

    return res.status(201).json({
      status: 'success',
      message: `${user.username} replied to ${commentDetails.userId.username}'s comment.`,
      reply: replyDetails
    });
  } catch (err) {
    return res.status(500).json({
      status: 'failure',
      message: 'An error occurred while processing your request.',
      error: err.message
    });
  }
};

export const deleteReply = async (req, res, next) => {
  try {
    const { replyId, userId } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: 'failure',
        message: 'User not found.'
      });
    }

    // Check if the reply exists
    const replyDetails = await Reply.findById(replyId);
    if (!replyDetails) {
      return res.status(404).json({
        status: 'failure',
        message: 'Reply not found.'
      });
    }

    // Check if the reply belongs to the user
    if (userId !== replyDetails.userId.toString()) {
      return res.status(403).json({
        status: 'failure',
        message: 'You can only delete your own replies.'
      });
    }

    // Check if the comment exists
    const commentDetails = await Comment.findById(replyDetails.commentId).populate(
      'userId',
      'username'
    );
    if (!commentDetails) {
      return res.status(404).json({
        status: 'failure',
        message: 'Comment not found.'
      });
    }

    // Delete the reply
    await Reply.findByIdAndDelete(replyId);

    return res.status(200).json({
      status: 'success',
      message: `${user.username} deleted their reply to ${commentDetails.userId.username}'s comment.`
    });
  } catch (err) {
    return res.status(500).json({
      status: 'failure',
      message: 'An error occurred while processing your request.',
      error: err.message
    });
  }
};

export const likeReply = async (req, res, next) => {
  try {
    const { replyId, userId } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: 'failure',
        message: 'User not found.'
      });
    }

    // Check if the reply exists
    const replyDetails = await Reply.findById(replyId).populate('userId', 'username');
    if (!replyDetails) {
      return res.status(404).json({
        status: 'failure',
        message: 'Reply not found.'
      });
    }

    // Check if the user has already liked this reply
    const existingLike = await Like.findOne({ replyId, userId });
    if (existingLike) {
      return res.status(400).json({
        status: 'failure',
        message: 'You have already liked this reply.'
      });
    }

    // Increment the like count on the reply
    replyDetails.likes += 1;
    await replyDetails.save();

    // Save the like details
    await Like.create({ replyId, userId });

    // Return success response
    return res.status(201).json({
      status: 'success',
      message: `${user.username} liked ${replyDetails.userId.username}'s reply.`
    });
  } catch (err) {
    return res.status(500).json({
      status: 'failure',
      message: 'An error occurred while liking the reply.',
      error: err.message
    });
  }
};

export const unlikeReply = async (req, res, next) => {
  try {
    const { userId, likeId } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: 'failure',
        message: 'User not found.'
      });
    }

    // Check if the like record exists
    const likeDetails = await Like.findById(likeId).populate('userId', 'username');
    if (!likeDetails) {
      return res.status(404).json({
        status: 'failure',
        message: 'Like record not found.'
      });
    }

    // Check if the like belongs to the user
    if (userId !== likeDetails.userId._id.toString()) {
      return res.status(403).json({
        status: 'failure',
        message: 'You can only unlike your own likes.'
      });
    }

    // Check if the reply exists
    const replyDetails = await Reply.findById(likeDetails.replyId).populate(
      'userId',
      'username'
    );
    if (!replyDetails) {
      return res.status(404).json({
        status: 'failure',
        message: 'Reply not found.'
      });
    }

    // Decrement the like count if greater than 0
    if (replyDetails.likes > 0) {
      replyDetails.likes -= 1;
      await replyDetails.save(); // Save the updated reply
    }

    // Delete the like record
    await Like.findByIdAndDelete(likeId);

    return res.status(200).json({
      status: 'success',
      message: `${user.username} unliked ${replyDetails.userId.username}'s reply.`
    });
  } catch (err) {
    return res.status(500).json({
      status: 'failure',
      message: 'An error occurred while processing your request.',
      error: err.message
    });
  }
};
