import Joi from 'joi';
import { schemaValidation } from '../../helpers/validation/validation.helper.js';

export const likeCommentValidation = async (req, res, next) => {
  const schema = Joi.object({
    commentId: Joi.string(), // Required, must be a valid MongoDB ObjectId
    replyId: Joi.string(),
    userId: Joi.string().required(), // Required, user who likes the post
    date: Joi.date().optional().default(Date.now) // Optional, defaults to the current date
  }).or('commentId', 'replyId');

  const error = await schemaValidation(schema, req.body);
  if (error) {
    return res.status(400).json({
      status: 'failure',
      message: error.details[0].message
    });
  }

  next();
};
