import { Router } from 'express';
import { userValidation } from '../../utils/validations/user.validation.js';
import {
  followingUserProfile,
  userLogin,
  userRegistration
} from '../../controllers/user/user.controller.js';
import { loginValidation } from '../../utils/validations/user.login.validation.js';
import { followsValidation } from '../../utils/validations/user.follow.validation.js';
import {
  followUser,
  unfollowUser,
  userFollowers,
  userFollowings
} from '../../controllers/follow/follow.controllers.js';

const userRouter = Router();

// User Registration Router
userRouter.post('/register', userValidation, userRegistration);

// User Login Router
userRouter.post('/login', loginValidation, userLogin);

// Following a user
userRouter.post('/follow', followsValidation, followUser);

// Unfollow a User
userRouter.delete('/unfollow', followsValidation, unfollowUser);

// Followers list
userRouter.get('/followers', userFollowers);

// Following list
userRouter.get('/:userId/followings', userFollowings);

// Profile of followingId
userRouter.get('/:followingId/profile', followingUserProfile);

export default userRouter;
