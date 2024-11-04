import Joi from 'joi';
import { schemaValidation } from '../../helpers/validation/validation.helper.js';
export const userValidation = async (req, res, next) => {
  // Define the schema with custom error messages
  const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(20).required().messages({
      'string.base': 'Username should be a string',
      'string.alphanum': 'Username should contain only letters and numbers',
      'string.min': 'Username should be at least 3 characters long',
      'string.max': 'Username should be at most 20 characters long',
      'any.required': 'Username is required'
    }),

    email: Joi.string().email().required().messages({
      'string.base': 'Email should be a string',
      'string.email': 'Email must be a valid email address',
      'any.required': 'Email is required'
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
      }),

    conformPassword: Joi.string().valid(Joi.ref('password')).required().messages({
      'string.base': 'Confirm Password should be a string',
      'any.only': 'Confirm Password must match Password',
      'any.required': 'Confirm Password is required'
    }),

    mobile: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        'string.base': 'Mobile number should be a string',
        'string.length': 'Mobile number must be exactly 10 digits',
        'string.pattern.base': 'Mobile number can only contain digits',
        'any.required': 'Mobile number is required'
      }),

    fullName: Joi.string().min(3).max(20).required().messages({
      'string.base': 'Full name should be a string',
      'string.min': 'Full name should be at least 3 characters long',
      'string.max': 'Full name should be at most 20 characters long',
      'any.required': 'Full name is required'
    }),

    gender: Joi.string().valid('male', 'female', 'other').required().messages({
      'string.base': 'Gender should be a string',
      'string.valid': 'Gender must be one of: male, female, other',
      'any.required': 'Gender is required'
    }),

    profilePicture: Joi.string().uri().messages({
      'string.base': 'Profile Picture should be a string',
      'string.uri': 'Profile Picture must be a valid URI'
    }),

    dateOfBirth: Joi.date().less('now').messages({
      'date.base': 'Date of Birth should be a valid date',
      'date.less': 'Date of Birth cannot be in the future'
    }),
    followers: Joi.array(),
    following: Joi.array()
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
