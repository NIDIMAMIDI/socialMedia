import { Router } from 'express';
import userRouter from './user/user.routes.js';
import postRouter from './post/post.routes.js';
const router = Router();

router.use('/user', userRouter);
router.use('/post', postRouter);

export default router;
