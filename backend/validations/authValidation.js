import Joi from 'joi';

/**
 * Validation schema for user registration
 * @param {Object} data - Registration data
 * @returns {Object} - Validation result
 */
export const registerValidator = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required()
      .messages({
        'string.min': 'Name must be at least 3 characters long',
        'string.max': 'Name cannot exceed 50 characters',
        'string.empty': 'Name is required',
        'any.required': 'Name is required'
      }),
    
    email: Joi.string().email().required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'string.empty': 'Email is required',
        'any.required': 'Email is required'
      }),
    
    password: Joi.string().min(8).required()
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$'))
      .messages({
        'string.min': 'Password must be at least 8 characters long',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
        'string.empty': 'Password is required',
        'any.required': 'Password is required'
      }),
    
    role: Joi.string().valid('patient', 'doctor').required()
      .messages({
        'any.only': 'Role must be either patient or doctor',
        'string.empty': 'Role is required',
        'any.required': 'Role is required'
      }),
    
    gender: Joi.string().valid('male', 'female').required()
      .messages({
        'any.only': 'Gender must be either male or female',
        'string.empty': 'Gender is required',
        'any.required': 'Gender is required'
      }),
    
    photo: Joi.any(),
    
    // Doctor-specific fields
    specialization: Joi.when('role', {
      is: 'doctor',
      then: Joi.string().required()
        .messages({
          'string.empty': 'Specialization is required for doctors',
          'any.required': 'Specialization is required for doctors'
        }),
      otherwise: Joi.string().allow('', null)
    }),
    
    ticketPrice: Joi.when('role', {
      is: 'doctor',
      then: Joi.number().min(0).required()
        .messages({
          'number.base': 'Ticket price must be a number',
          'number.min': 'Ticket price cannot be negative',
          'any.required': 'Ticket price is required for doctors'
        }),
      otherwise: Joi.number().allow(null)
    }),
    
    qualifications: Joi.when('role', {
      is: 'doctor',
      then: Joi.array().items(
        Joi.object({
          degree: Joi.string().required(),
          institution: Joi.string().required(),
          startDate: Joi.date().required(),
          endDate: Joi.date().required()
        })
      ).allow(null),
      otherwise: Joi.array().allow(null)
    }),
    
    experiences: Joi.when('role', {
      is: 'doctor',
      then: Joi.array().items(
        Joi.object({
          position: Joi.string().required(),
          hospital: Joi.string().required(),
          startDate: Joi.date().required(),
          endDate: Joi.date().allow(null)
        })
      ).allow(null),
      otherwise: Joi.array().allow(null)
    }),
    
    bio: Joi.when('role', {
      is: 'doctor',
      then: Joi.string().max(50).allow('', null)
        .messages({
          'string.max': 'Bio cannot exceed 50 characters'
        }),
      otherwise: Joi.string().allow('', null)
    }),
    
    about: Joi.when('role', {
      is: 'doctor',
      then: Joi.string().allow('', null),
      otherwise: Joi.string().allow('', null)
    }),
    
    timeSlots: Joi.when('role', {
      is: 'doctor',
      then: Joi.array().items(
        Joi.object({
          day: Joi.string().required(),
          startTime: Joi.string().required(),
          endTime: Joi.string().required()
        })
      ).allow(null),
      otherwise: Joi.array().allow(null)
    })
  });
  
  return schema.validate(data, { abortEarly: false });
};

/**
 * Validation schema for user login
 * @param {Object} data - Login data
 * @returns {Object} - Validation result
 */
export const loginValidator = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'string.empty': 'Email is required',
        'any.required': 'Email is required'
      }),
    
    password: Joi.string().required()
      .messages({
        'string.empty': 'Password is required',
        'any.required': 'Password is required'
      })
  });
  
  return schema.validate(data, { abortEarly: false });
};
