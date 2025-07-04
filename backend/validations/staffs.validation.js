const Joi = require('joi');

// Validation Schema for User
const validateStaff = (data) => {
  const schema = Joi.object({
    name: Joi.string().pattern(/^[a-zA-Z0-9 _-]+$/).min(3).max(50).required().messages({
      'string.base': 'Name must be a string.',
      'string.empty': 'Name is required.',
      'string.pattern.base': 'Name can only contain letters, numbers, spaces, underscores (_), and hyphens (-).',
      'string.min': 'Name should have at least 3 characters.',
      'string.max': 'Name should not exceed 50 characters.',
      'any.required': 'Name is required.',
    }),
    email: Joi.string().email().messages({
      'string.email': 'Invalid email address.',
    }),
    primaryPhoneNo: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required()
      .messages({
        'string.pattern.base':
          'Primary phone number must be a 10-digit number.',
        'string.empty': 'Primary phone number is required.',
        'any.required': 'Primary phone number is required.',
      }),
    alternatePhoneNo: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .allow(null, '')
      .messages({
        'string.pattern.base':
          'Alternate phone number must be a 10-digit number.',
      }),
    city: Joi.string().pattern(/^[a-zA-Z0-9 _\-&]+$/).max(100).allow(null, '').messages({
      'string.pattern.base': 'City can only contain letters, numbers, spaces, underscores (_), hyphens (-), and ampersands (&).',
    }),
    activeStatus: Joi.boolean(),
    roleId: Joi.string()
      .pattern(/^[a-fA-F0-9]{24}$/)
      .messages({
        'string.pattern.base': 'Invalid role format.',
      }),
    companyId: Joi.string()
      .pattern(/^[a-fA-F0-9]{24}$/)
      .required()
      .messages({
        'string.pattern.base': 'Invalid company ID format.',
        'string.empty': 'Company ID is required.',
        'any.required': 'Company ID is required',
      }),
    branchId: Joi.string()
      .pattern(/^[a-fA-F0-9]{24}$/)
      .allow(null, '')
      .messages({
        'string.pattern.base': 'Invalid branch ID format.',
      }),
    createdBy: Joi.string()
                  .pattern(/^[a-fA-F0-9]{24}$/)
                  .allow(null, '')
                  .messages({
                    'string.pattern.base': 'Invalid ID format.',
                  }),
  });
  return schema.validate(data, { abortEarly: false });
};

module.exports = { validateStaff };
