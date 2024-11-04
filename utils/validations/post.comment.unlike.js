import Joi from 'joi';
import { schemaValidation } from '../../helpers/validation/validation.helper.js';

export const unlikeCommentValidation = async (req, res, next) => {
  const schema = Joi.object({
    likeId: Joi.string().required(), // Required, must be a valid MongoDB ObjectId
    userId: Joi.string().required() // Required, user who likes the post
  });

  const error = await schemaValidation(schema, req.body);
  if (error) {
    return res.status(400).json({
      status: 'failure',
      message: error.details[0].message
    });
  }

  next();
};
