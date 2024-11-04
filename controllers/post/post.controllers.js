import { Like } from '../../models/like/like.model.js';
import { Post } from '../../models/post/post.model.js';
import { User } from '../../models/user/user.model.js';

export const uploadPost = async (req, res, next) => {
  try {
    const { image, video, caption, likes, userId, date } = req.body;

    // Validate user existence
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: 'failure',
        message: 'User not found'
      });
    }

    // Create the post
    const post = await Post.create({
      image,
      video,
      caption,
      likes,
      userId,
      date
    });

    return res.status(201).json({
      status: 'success',
      message: 'Post created successfully',
      post
    });
  } catch (err) {
    return res.status(500).json({
      status: 'failure',
      message: err.message || 'An error occurred while creating the post'
    });
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const { postId, userId } = req.body;

    // Validate user existence
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: 'failure',
        message: 'User not found'
      });
    }

    // Check if the post exists and belongs to the user
    const postDetails = await Post.findOne({ _id: postId, userId });
    if (!postDetails) {
      return res.status(404).json({
        status: 'failure',
        message: 'Post not found or does not belong to the user'
      });
    }

    // Delete the post
    await Post.findByIdAndDelete(postId);

    return res.status(200).json({
      status: 'success',
      message: 'Post has been deleted successfully'
    });
  } catch (err) {
    return res.status(500).json({
      status: 'failure',
      message: err.message || 'An error occurred while deleting the post'
    });
  }
};

export const likePost = async (req, res, next) => {
  try {
    const { userId, postId } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: 'failure',
        message: 'User not found'
      });
    }

    // Check if the post exists
    const post = await Post.findById(postId).populate('userId', 'username');

    if (!post) {
      return res.status(404).json({
        status: 'failure',
        message: 'Post not found'
      });
    }

    // Check if the user has already liked the post
    const existingLike = await Like.findOne({ userId, postId });
    if (existingLike) {
      return res.status(400).json({
        status: 'failure',
        message: 'User has already liked this post'
      });
    }

    // Create a new Like document
    await Like.create({ userId, postId });

    // Increment the likes count on the post
    post.likes += 1;
    await post.save();

    // Send a success response
    return res.status(201).json({
      status: 'success',
      message: `${user.username} liked the ${post.userId.username} post`
    });
  } catch (err) {
    return res.status(500).json({
      status: 'failure',
      message: err.message
    });
  }
};

export const unlikePost = async (req, res, next) => {
  try {
    const { likeId, userId } = req.body;

    // Check if the user exists

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: 'failure',
        message: 'User not found.'
      });
    }

    // Find the like record by ID
    const like = await Like.findById(likeId);
    if (!like) {
      return res.status(404).json({
        status: 'failure',
        message: 'Like not found.'
      });
    }

    // Check if the like belongs to the user
    if (userId !== like.userId.toString()) {
      return res.status(403).json({
        status: 'failure',
        message: 'You can only unlike your own likes.'
      });
    }

    // Find the associated post by ID
    const post = await Post.findById(like.postId).populate('userId', 'username');
    if (!post) {
      return res.status(404).json({
        status: 'failure',
        message: 'Post not found.'
      });
    }

    // Ensure likes don't go below zero
    if (post.likes > 0) {
      post.likes -= 1;
    }

    // Save the updated post
    await post.save();

    // Delete the like record
    await Like.findByIdAndDelete(likeId);

    // Send success response
    return res.status(200).json({
      status: 'success',
      message: `${user.username} unliked ${post.userId.username}'s post.`
    });
  } catch (err) {
    return res.status(500).json({
      status: 'failure',
      message: 'An error occurred while processing your request.',
      error: err.message
    });
  }
};
