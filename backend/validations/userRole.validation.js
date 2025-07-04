const Joi = require('joi');

// Validation Schema for User Role
const validateUserRole = (data) => {
  const schema = Joi.object({
    roleId: Joi.string()
      .pattern(/^[a-fA-F0-9]{24}$/)
      .required()
      .messages({
        'string.pattern.base': 'Invalid role ID format.',
        'any.required': 'Role ID is required.',
      }),
    userId: Joi.string()
      .pattern(/^[a-fA-F0-9]{24}$/)
      .required()
      .messages({
        'string.pattern.base': 'Invalid user ID format.',
        'any.required': 'User ID is required.',
      }),
    companyId: Joi.string()
      .pattern(/^[a-fA-F0-9]{24}$/)
      .required()
      .messages({
        'string.pattern.base': 'Invalid company ID format.',
        'any.required': 'Company ID is required.',
      }),
    activeStatus: Joi.boolean().optional(),
  });

  return schema.validate(data);
}

// Export the validation function
module.exports = {
  validateUserRole,
};