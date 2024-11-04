import Joi from 'joi';
import { schemaValidation } from '../../helpers/validation/validation.helper.js';
export const idValidation = async (req, res, next) => {
  const schema = Joi.object({
    currentUserId: Joi.string().required()
  });
  const error = await schemaValidation(schema, req.body);
  if (error) {
    return res.status(500).json({
      status: 'failure',
      message: error.details[0].message
    });
  }
  next();
};
