import Joi from 'joi';
import { schemaValidation } from '../../helpers/validation/validation.helper.js';
export const loginValidation = async (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(20).required().messages({
      'string.base': 'Username should be a string',
      'string.alphanum': 'Username should contain only letters and numbers',
      'string.min': 'Username should be at least 3 characters long',
      'string.max': 'Username should be at most 20 characters long',
      'any.required': 'Username is required'
    }),
    password: Joi.string()
      .pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@])[A-Za-z\d@]{8,20}$/)
      .min(8)
      .max(20)
      .required()
      .messages({
        'string.base': 'Password should be a string',
        'string.pattern.base':
          // eslint-disable-next-line max-len
          'Password must be 8-20 characters long and include at least one uppercase letter, one number, and one special character (@)',
        'any.required': 'Password is required'
      })
  });

  // Validate request body against schema
  const error = await schemaValidation(schema, req.body);
  if (error) {
    return res.status(500).json({
      status: 'failure',
      message: error.details[0].message
    });
  }
  next();
};
