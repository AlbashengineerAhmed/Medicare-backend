import Joi from 'joi';

/**
 * Validation schema for creating an appointment
 * @param {Object} data - Appointment data
 * @returns {Object} - Validation result
 */
export const createAppointmentValidator = (data) => {
  const schema = Joi.object({
    doctor: Joi.string().required()
      .messages({
        'string.empty': 'Doctor ID is required',
        'any.required': 'Doctor ID is required'
      }),
    
    appointmentDate: Joi.date().min('now').required()
      .messages({
        'date.base': 'Appointment date must be a valid date',
        'date.min': 'Appointment date must be in the future',
        'any.required': 'Appointment date is required'
      }),
    
    timeSlot: Joi.string().required()
      .messages({
        'string.empty': 'Time slot is required',
        'any.required': 'Time slot is required'
      }),
    
    symptoms: Joi.string().allow('', null),
    
    medicalHistory: Joi.string().allow('', null)
  });
  
  return schema.validate(data, { abortEarly: false });
};

/**
 * Validation schema for updating appointment status
 * @param {Object} data - Status data
 * @returns {Object} - Validation result
 */
export const updateAppointmentStatusValidator = (data) => {
  const schema = Joi.object({
    status: Joi.string().valid('pending', 'confirmed', 'completed', 'cancelled').required()
      .messages({
        'any.only': 'Status must be one of: pending, confirmed, completed, cancelled',
        'string.empty': 'Status is required',
        'any.required': 'Status is required'
      }),
    
    notes: Joi.string().allow('', null),
    
    prescription: Joi.string().allow('', null)
  });
  
  return schema.validate(data, { abortEarly: false });
};
