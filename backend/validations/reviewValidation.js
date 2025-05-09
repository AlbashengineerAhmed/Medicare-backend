import Joi from 'joi';

/**
 * Validation schema for creating a review
 * @param {Object} data - Review data
 * @returns {Object} - Validation result
 */
export const createReviewValidator = (data) => {
  const schema = Joi.object({
    doctor: Joi.string().required()
      .messages({
        'string.empty': 'Doctor ID is required',
        'any.required': 'Doctor ID is required'
      }),
    
    rating: Joi.number().min(1).max(5).required()
      .messages({
        'number.base': 'Rating must be a number',
        'number.min': 'Rating must be at least 1',
        'number.max': 'Rating cannot exceed 5',
        'any.required': 'Rating is required'
      }),
    
    reviewText: Joi.string().required()
      .messages({
        'string.empty': 'Review text is required',
        'any.required': 'Review text is required'
      })
  });
  
  return schema.validate(data, { abortEarly: false });
};

/**
 * Validation schema for updating a review
 * @param {Object} data - Review data
 * @returns {Object} - Validation result
 */
export const updateReviewValidator = (data) => {
  const schema = Joi.object({
    rating: Joi.number().min(1).max(5)
      .messages({
        'number.base': 'Rating must be a number',
        'number.min': 'Rating must be at least 1',
        'number.max': 'Rating cannot exceed 5'
      }),
    
    reviewText: Joi.string()
      .messages({
        'string.empty': 'Review text cannot be empty'
      })
  });
  
  return schema.validate(data, { abortEarly: false });
};
