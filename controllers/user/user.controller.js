import { lowerCase } from '../../helpers/convert/convert.helper.js';
import { hashPassword, passwordChecker } from '../../helpers/pasword/passwordHelper.js';
import { User } from '../../models/user/user.model.js';
import { Post } from '../../models/post/post.model.js';

export const userRegistration = async (req, res, next) => {
  try {
    const {
      username,
      password,
      email,
      mobile,
      fullName,
      gender,
      profilePicture,
      dateOfBirth
    } = req.body;
    const user = await User.findOne({ username });
    if (user) {
      return res.status(404).json({
        status: 'failure',
        message: 'username is already exists'
      });
    }
    const loweredEmail = await lowerCase(email);
    const loweredGender = await lowerCase(gender);
    // hash the password with bcrypt module (plain password to hash password)
    const hashedPassword = await hashPassword(password, 12);

    const newUser = await User.create({
      username,
      password: hashedPassword,
      email: loweredEmail,
      mobile,
      fullName,
      gender: loweredGender,
      profilePicture,
      dateOfBirth
    });
    res.status(200).json({
      status: 'success',
      userData: { newUser }
    });
  } catch (err) {
    res.status(500).json({
      status: 'failure',
      message: err.message
    });
  }
};

export const userLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        status: 'failure',
        message: 'User not found'
      });
    }

    const isPasswordCorrect = await passwordChecker(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(404).json({
        status: 'failure',
        message: 'Incorrect Password'
      });
    }
    // Exclude password, createdAt, and updatedAt fields from the user object
    // eslint-disable-next-line max-len
    const { password: pwd, createdAt, updatedAt, ...otherFields } = user._doc; // user._doc gives all the fields of a user

    res.status(200).json({
      status: 'success',
      message: 'Login Successfull',
      data: {
        user: otherFields
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'failure',
      message: err.message
    });
  }
};

export const followingUserProfile = async (req, res, next) => {
  try {
    const { followingId } = req.params;

    // Fetch the user by ID
    const user = await User.findById(followingId);
    if (!user) {
      return res.status(404).json({
        status: 'failure',
        message: 'User not found.'
      });
    }

    // Exclude sensitive information and unwanted fields
    const { password, createdAt, updatedAt, ...other } = user._doc;

    // Fetch the posts associated with the user
    const posts = await Post.find({ userId: followingId });
    if (posts.length === 0) {
      return res.status(200).json({
        status: 'success',
        message: `${user.username} has no posts.`,
        profileDetails: {
          ...other,
          posts: []
        }
      });
    }

    // Return the profile details and posts
    return res.status(200).json({
      status: 'success',
      message: `${user.username}'s profile details.`,
      profileDetails: {
        ...other,
        posts
      }
    });
  } catch (err) {
    return res.status(500).json({
      status: 'failure',
      message: 'An error occurred while processing your request.',
      error: err.message
    });
  }
};
