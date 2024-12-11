const Joi = require('joi');

const branchValidation = (data) => {
	const schema = Joi.object({
		name: Joi.string().min(3).max(100).required().messages({
			'string.min': 'Branch name must be at least 3 characters long.',
			'string.max': 'Branch name cannot exceed 100 characters.',
			'string.empty': 'Branch name is required.',
			'any.required': 'Branch name is required.',
		}),
		address: Joi.string().min(10).max(255).required().messages({
			'string.min': 'Branch address must be at least 10 characters long.',
			'string.max': 'Branch address cannot exceed 255 characters.',
			'string.empty': 'Branch address is required.',
			'any.required': 'Branch address is required.',
		}),
		companyId: Joi.string()
			.pattern(/^[a-fA-F0-9]{24}$/)
			.required()
			.messages({
				'string.pattern.base': 'Invalid company ID format.',
				'string.empty': 'Company ID is required.',
				'any.required': 'Company ID is required.',
			}),
		email: Joi.string().email().required().messages({
			'string.base': 'Email must be a valid string.',
			'string.email': 'Please provide a valid email address.',
		}),
		phone: Joi.string()
			.pattern(/^[0-9]{10}$/)
			.required()
			.messages({
				'string.base': 'Phone number must be a valid string.',
				'string.pattern.base': 'Phone number must be a 10-digit number.',
			}),
		activeStatus: Joi.boolean().messages({
			'boolean.base': 'Active status must be true or false.',
		}),
	});

	return schema.validate(data);
};

module.exports = branchValidation;
