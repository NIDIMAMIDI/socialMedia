import { Comment } from '../../models/comment/comment.model.js';
import { Like } from '../../models/like/like.model.js';
import { Post } from '../../models/post/post.model.js';
import { User } from '../../models/user/user.model.js';

export const postComment = async (req, res, next) => {
  try {
    const { postId, userId, comment } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: 'failure',
        message: 'User not found.'
      });
    }

    // Check if the post exists and populate the user's username who created the post
    const post = await Post.findById(postId).populate('userId', 'username');
    if (!post) {
      return res.status(404).json({
        status: 'failure',
        message: 'Post not found.'
      });
    }

    // Create the comment
    const commentDetails = await Comment.create({ postId, comment, userId });

    // Return success message
    return res.status(201).json({
      status: 'success',
      message: `${user.username} commented on ${post.userId.username}'s post.`,
      data: commentDetails
    });
  } catch (err) {
    return res.status(500).json({
      status: 'failure',
      message: 'An error occurred while posting the comment.',
      error: err.message
    });
  }
};

export const deletePostComment = async (req, res, next) => {
  try {
    const { commentId, userId } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: 'failure',
        message: 'User not found.'
      });
    }

    // Check if comment exists
    const commentDetails = await Comment.findById(commentId);
    if (!commentDetails) {
      return res.status(404).json({
        status: 'failure',
        message: 'Comment not found.'
      });
    }

    // Ensure the comment belongs to the user
    if (userId.toString() !== commentDetails.userId.toString()) {
      return res.status(403).json({
        status: 'failure',
        message: 'You are not authorized to delete this comment.'
      });
    }

    // Delete the comment
    await Comment.findByIdAndDelete(commentId);
    return res.status(200).json({
      status: 'success',
      message: 'Comment deleted successfully.'
    });
  } catch (err) {
    return res.status(500).json({
      status: 'failure',
      message: 'An error occurred while deleting the comment.',
      error: err.message
    });
  }
};

export const commentLike = async (req, res, next) => {
  try {
    const { commentId, userId } = req.body;

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

    // Check if the user has already liked this reply
    const existingLike = await Like.findOne({ commentId, userId });
    if (existingLike) {
      return res.status(400).json({
        status: 'failure',
        message: 'You have already liked this Comment.'
      });
    }

    // Increment the like count on the comment
    commentDetails.likes += 1;
    await commentDetails.save();

    // Save the like details
    await Like.create({ commentId, userId });

    // Return success response
    return res.status(201).json({
      status: 'success',
      message: `${user.username} liked ${commentDetails.userId.username}'s comment.`
    });
  } catch (err) {
    return res.status(500).json({
      status: 'failure',
      message: 'An error occurred while liking the comment.',
      error: err.message
    });
  }
};

export const unlikeComment = async (req, res, next) => {
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

    // Check if the comment exists
    const commentDetails = await Comment.findById(likeDetails.commentId).populate(
      'userId',
      'username'
    );
    if (!commentDetails) {
      return res.status(404).json({
        status: 'failure',
        message: 'Comment not found.'
      });
    }

    // Decrement the like count if greater than 0
    if (commentDetails.likes > 0) {
      commentDetails.likes -= 1;
      await commentDetails.save(); // Save the updated comment
    }

    // Delete the like record
    await Like.findByIdAndDelete(likeId);

    return res.status(200).json({
      status: 'success',
      message: `${user.username} unliked ${commentDetails.userId.username}'s comment.`
    });
  } catch (err) {
    return res.status(500).json({
      status: 'failure',
      message: 'An error occurred while processing your request.',
      error: err.message
    });
  }
};
