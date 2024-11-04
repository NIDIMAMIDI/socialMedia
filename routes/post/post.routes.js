import { Router } from 'express';
import {
  deletePost,
  likePost,
  unlikePost,
  uploadPost
} from '../../controllers/post/post.controllers.js';
import { postValidation } from '../../utils/validations/post.upload.validation.js';
import { deletePostValidation } from '../../utils/validations/post.delete.validation.js';
import { likeValidation } from '../../utils/validations/post.like.validation.js';
import { validateComment } from '../../utils/validations/post.comment.validation.js';
import {
  commentLike,
  deletePostComment,
  postComment,
  unlikeComment
} from '../../controllers/comment/comment.controllers.js';
import { deleteCommentValidation } from '../../utils/validations/post.comment.delete.validation.js';
import { likeCommentValidation } from '../../utils/validations/post.comment.like.validation.js';
import { unlikeCommentValidation } from '../../utils/validations/post.comment.unlike.js';
import { validateReply } from '../../utils/validations/comment.reply.validation.js';
import {
  commentReply,
  deleteReply,
  likeReply,
  unlikeReply
} from '../../controllers/reply/reply.controllers.js';
import { deleteReplyValidation } from '../../utils/validations/comment.reply.delete.validation.js';

const postRouter = Router();

// Post upload Router
postRouter.post('/upload', postValidation, uploadPost);

// Delete Post Router
postRouter.delete('/delete', deletePostValidation, deletePost);

// Like a post
postRouter.post('/like', likeValidation, likePost);

// Unlike the post
postRouter.delete('/unlike', unlikeCommentValidation, unlikePost);

// comment the post
postRouter.post('/comment', validateComment, postComment);

//  delete the comment
postRouter.delete('/comment/delete', deleteCommentValidation, deletePostComment);

// like the comment
postRouter.post('/comment/like', likeCommentValidation, commentLike);

// unlike the post comment's
postRouter.delete('/comment/unlike', unlikeCommentValidation, unlikeComment);

// Reply a comment
postRouter.post('/comment/reply', validateReply, commentReply);

// Delete a reply
postRouter.delete('/comment/reply/delete/', deleteReplyValidation, deleteReply);

// like a reply
postRouter.post('/comment/reply/like', likeCommentValidation, likeReply);

// Unlike a reply
postRouter.delete('/comment/reply/unlike', unlikeCommentValidation, unlikeReply);

export default postRouter;
