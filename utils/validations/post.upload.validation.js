import Joi from 'joi';
import { schemaValidation } from '../../helpers/validation/validation.helper.js';

export const postValidation = async (req, res, next) => {
  const schema = Joi.object({
    image: Joi.string().optional(), // Optional, must be a valid URI if provided use uri()
    video: Joi.string().optional(), // Optional, must be a valid URI if provided
    caption: Joi.string().max(500).optional(), // Optional, max 500 characters
    // eslint-disable-next-line max-len
    likes: Joi.number().integer().min(0).default(0), // Optional, must be a non-negative integer, defaults to 0
    userId: Joi.string().required(), // Required, must be a valid MongoDB ObjectId
    date: Joi.date().optional().default(Date.now) // Optional, defaults to the current date
  }).or('image', 'video'); // Ensure at least one of 'image' or 'video' is provided

  const error = await schemaValidation(schema, req.body);
  if (error) {
    return res.status(400).json({
      status: 'failure',
      message: error.details[0].message
    });
  }

  next();
};
