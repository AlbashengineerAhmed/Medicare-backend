/**
 * Validation middleware
 * @param {Function} validator - Validation function
 * @returns {Function} - Express middleware
 */
export const validate = (validator) => {
  return (req, res, next) => {
    const { error } = validator(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
        errors: error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
      });
    }
    
    next();
  };
};
