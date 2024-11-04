import Joi from 'joi';
import { schemaValidation } from '../../helpers/validation/validation.helper.js';

export const followsValidation = async (req, res, next) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    followingId: Joi.string().required(),
    state: Joi.string().valid('pending', 'accepted', 'rejected').default('pending')
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
