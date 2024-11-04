import { Follows } from '../../models/follow/follow.model.js';
import { User } from '../../models/user/user.model.js';

export const followUser = async (req, res, next) => {
  try {
    const { userId: followerId, followingId } = req.body;

    // Prevent a user from following themselves
    if (followerId === followingId) {
      return res.status(400).json({
        status: 'failure',
        message: 'You cannot follow yourself.'
      });
    }

    // Verify that the follower exists
    const follower = await User.findById(followerId);
    if (!follower) {
      return res.status(404).json({
        status: 'failure',
        message: 'Follower not found.'
      });
    }

    // Verify that the user to be followed exists
    const following = await User.findById(followingId);
    if (!following) {
      return res.status(404).json({
        status: 'failure',
        message: 'User to be followed not found.'
      });
    }

    // Check if the follow relationship already exists
    const existingFollow = await Follows.findOne({ followerId, followingId });

    if (existingFollow) {
      return res.status(200).json({
        status: 'success',
        message: `${follower.username} is already following to ${following.username}`,
        data: existingFollow
      });
    } else {
      // Create the follow request with a "pending" state
      const followDetails = await Follows.create({
        followerId,
        followingId
        // state: 'pending'
      });

      // Check if the following user is already following the follower
      // const reciprocalFollow = await Follows.findOne({
      //   followerId: followingId,
      //   followingId: followerId
      // });

      // if (reciprocalFollow && reciprocalFollow.state === 'pending') {
      //   // Update both follow requests to "accepted" if the reciprocal follow exists
      //   followDetails.state = 'accepted';
      //   reciprocalFollow.state = 'accepted';

      //   await followDetails.save();
      //   await reciprocalFollow.save();

      //   return res.status(201).json({
      //     status: 'success',
      //     message: `${follower.username} and ${following.username} are now following each other.`,
      //     data: followDetails
      //   });
      // }

      return res.status(201).json({
        status: 'success',
        message: `Follow request sent to ${following.username}.`,
        data: followDetails
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: 'failure',
      message: 'An error occurred while processing your request.',
      error: err.message
    });
  }
};

export const unfollowUser = async (req, res, next) => {
  try {
    const { userId: followerId, followingId } = req.body;
    // Prevent a user from unfollowing themselves
    if (followerId === followingId) {
      return res.status(400).json({
        status: 'failure',
        message: 'You cannot unfollow yourself.'
      });
    }

    // Verify that the follower exists
    const follower = await User.findById(followerId);
    if (!follower) {
      return res.status(404).json({
        status: 'failure',
        message: 'Follower not found.'
      });
    }

    // Verify that the user to be unfollowed exists
    const following = await User.findById(followingId);
    if (!following) {
      return res.status(404).json({
        status: 'failure',
        message: 'User to be unfollowed not found.'
      });
    }

    // Check if the follow relationship exists
    const followDetails = await Follows.findOne({ followerId, followingId });
    if (!followDetails) {
      return res.status(404).json({
        status: 'failure',
        message: `${follower.username} is not following ${following.username}.`
      });
    }

    // Delete the follow relationship
    await Follows.deleteOne({ followerId, followingId });
    return res.status(200).json({
      status: 'success',
      message: `${follower.username} unfollowed ${following.username}.`
    });
  } catch (err) {
    return res.status(500).json({
      status: 'failure',
      message: 'An error occurred while processing your request.',
      error: err.message
    });
  }
};

// import mongoose from 'mongoose';
// import User from '../models/User';
// import Follows from '../models/Follows';

export const userFollowers = async (req, res, next) => {
  try {
    const { targetId, userId } = req.query;

    // Check if the user exists
    const user = await User.findById(targetId);
    if (!user) {
      return res.status(404).json({
        status: 'failure',
        message: 'User not found.'
      });
    }

    // Fetch all followers of the target user
    const followers = await Follows.find({ followingId: targetId })
      .lean()
      .populate('followerId', 'username');

    // Extract follower IDs into an array
    const followerIds = followers.map((item) => item.followerId._id.toString());

    // Fetch all follow relationships where the current user (userId) is following these followers
    const existingFollows = await Follows.find({
      followerId: userId,
      followingId: { $in: followerIds }
    }).select('followingId');

    // Create a Set of followingIds for quick lookup
    const followingSet = new Set(
      existingFollows.map((follow) => follow.followingId.toString())
    );

    // Update followers array with isHeFollowing and isAmFollowing properties
    followers.forEach((item) => {
      item.isHeFollowing = followingSet.has(item.followerId._id.toString());
      item.isAmFollowing = followerIds.includes(userId.toString());
    });

    res.status(200).json({
      status: 'success',
      followers
    });
  } catch (err) {
    return res.status(500).json({
      status: 'failure',
      message: 'An error occurred while processing your request.',
      error: err.message
    });
  }
};

// export const userFollowers = async (req, res, next) => {
//   try {
//     const { targetId, userId } = req.query;

//     // Check if the user exists
//     const user = await User.findById(targetId);
//     if (!user) {
//       return res.status(404).json({
//         status: 'failure',
//         message: 'User not found.'
//       });
//     }

//     // Fetch all followers of the user
//     const followers = await Follows.find({ followingId: targetId })
//       .lean()
//       .populate('followerId', 'username');

//     // const userFollowers = await Follows.find({ followerId: userId });
//     // // Extract follower IDs into arrays
//     // console.log('userFollowers : ', userFollowers);

//     const followerIds = followers.map((item) => item.followerId._id);

//     console.log('followerIds : ', followerIds);

//     // Fetch all follow relationships in a single query
//     const existingFollows = await Follows.find({
//       followerId: { $in: followerIds },
//       followingId: userId
//     }).select('followerId');

//     console.log('existingFollows : ', existingFollows);

//     // res.send(existingFollows);

//     // console.log('existingFollows : ', existingFollows);

//     // // Create a Set of followingIds for quick lookup
//     const followingSet = new Set(
//       existingFollows.map((follow) => follow.followerId.toString())
//     );
//     console.log('followingSet : ', followingSet);

//     // Update followers array
//     followers.forEach((item) => {
//       item.isHeFollowing = followingSet.has(item.followerId._id.toString());
//     });

//     res.status(200).json({
//       status: 'success',
//       followers
//     });

//     // for (const item of followers) {
//     //   item.iamFollowing = false;

//     //   const followExist = await Follows.findOne({
//     //     followerId: userId,
//     //     followingId: item.followerId._id
//     //   });

//     //   if (followExist) item.iamFollowing = true;
//     // }

//     // Extract follower IDs into an array
//     // const followerIds = followers.map((follow) => follow.followerId._id);

//     // If no followers are found, return an appropriate message
//     // if (followers.length === 0) {
//     //   return res.status(200).json({
//     //     status: 'success',
//     //     message: `${user.username} has no followers.`,
//     //     data: []
//     //   });
//     // }
//     // // console.log(followerIds);

//     // // Return the list of followers
//     // return res.status(200).json({
//     //   status: 'success',
//     //   message: `${user.username} has ${followers.length} follower(s).`,
//     //   data: followers
//     // });
//   } catch (err) {
//     return res.status(500).json({
//       status: 'failure',
//       message: 'An error occurred while processing your request.',
//       error: err.message
//     });
//   }
// try {
//   const { targetId, userId } = req.query;

//   // Check if the user exists
//   const user = await User.findById(targetId);
//   if (!user) {
//     return res.status(404).json({
//       status: 'failure',
//       message: 'User not found.'
//     });
//   }

//   // Fetch all followers of the user
//   const followers = await Follows.find({ followingId: targetId })
//     .lean()
//     .populate('followerId', 'username');

//   const userFollowers = await Follows.find({ followerId: userId });
//   // Extract follower IDs into arrays
//   const targetIds = followers.map((follow) => follow.followerId._id.toString());
//   const userIds = userFollowers.map((follow) => follow.followingId.toString());

//   // const commonFollowers = targetIds.filter((x) => userIds.includes(x));
//   // console.log('common followers: ', commonFollowers);

//   // fetching the follwer ids
//   const followerIds = followers.map((item) => item.followerId._id);

//   console.log('followerIds : ', followerIds);

//   // Fetch all follow relationships in a single query
//   const existingFollows = await Follows.find({
//     followerId: userId,
//     followingId: { $in: followerIds }
//   }).select('followingId');

//   console.log('existingFollows : ', existingFollows);

//   // Create a Set of followingIds for quick lookup
//   const followingSet = new Set(
//     existingFollows.map((follow) => follow.followingId.toString())
//   );
//   console.log('followingSet : ', followingSet);

//   // Update followers array
//   followers.forEach((item) => {
//     item.iamFollowing = followingSet.has(item.followerId._id.toString());
//   });

//   // for (const item of followers) {
//   //   item.iamFollowing = false;

//   //   const followExist = await Follows.findOne({
//   //     followerId: userId,
//   //     followingId: item.followerId._id
//   //   });

//   //   if (followExist) item.iamFollowing = true;
//   // }

//   // Extract follower IDs into an array
//   // const followerIds = followers.map((follow) => follow.followerId._id);

//   // If no followers are found, return an appropriate message
//   if (followers.length === 0) {
//     return res.status(200).json({
//       status: 'success',
//       message: `${user.username} has no followers.`,
//       data: []
//     });
//   }
//   // console.log(followerIds);

//   // Return the list of followers
//   return res.status(200).json({
//     status: 'success',
//     message: `${user.username} has ${followers.length} follower(s).`,
//     data: followers
//   });
// } catch (err) {
//   return res.status(500).json({
//     status: 'failure',
//     message: 'An error occurred while processing your request.',
//     error: err.message
//   });
// }
// };

export const userFollowings = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: 'failure',
        message: 'User not found.'
      });
    }

    // Fetch all followings of the user
    const followings = await Follows.find({ followerId: userId }).populate(
      'followingId',
      'username'
    );

    // If no followers are found, return an appropriate message
    if (followings.length === 0) {
      return res.status(200).json({
        status: 'success',
        message: `${user.username} is not following anyone.`,
        data: []
      });
    }

    // Return the list of followers
    return res.status(200).json({
      status: 'success',
      message: `${user.username} is following ${followings.length} user(s).`,
      data: followings
    });
  } catch (err) {
    return res.status(500).json({
      status: 'failure',
      message: 'An error occurred while processing your request.',
      error: err.message
    });
  }
};
