import Joi from 'joi';
import { schemaValidation } from '../../helpers/validation/validation.helper.js';

export const validateComment = async (req, res, next) => {
  const schema = Joi.object({
    comment: Joi.string().trim().required(),
    userId: Joi.string().required(),
    postId: Joi.string().required(),
    date: Joi.date().default(Date.now),
    like: Joi.number().integer().min(0).default(0)
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
