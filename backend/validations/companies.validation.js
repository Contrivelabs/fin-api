const Joi = require('joi');
const mongoose = require('mongoose');

const companyValidation = (data) => {
	const schema = Joi.object({
		name: Joi.string().min(3).max(100).required().messages({
			'string.base': 'Company name must be a string.',
			'string.empty': 'Company name is required.',
			'string.min': 'Company name must be at least 3 characters long.',
			'string.max': 'Company name must not exceed 100 characters.',
			'any.required': 'Company name is required.',
		}),
		address: Joi.string().min(10).max(255).messages({
			'string.base': 'Address must be a string.',
			//'string.empty': 'Address is required.',
			'string.min': 'Address must be at least 10 characters long.',
			'string.max': 'Address must not exceed 255 characters.',
			//'any.required': 'Address is required.',
		}),
		userId: Joi.string()
			.pattern(/^[a-fA-F0-9]{24}$/)
			.required()
			.messages({
				'string.pattern.base': 'Invalid company ID format.',
				'string.empty': 'Company ID is required.',
				'any.required': 'Company ID is required',
			}),
		email: Joi.string().email().messages({
			'string.base': 'Email must be a valid string.',
			'string.email': 'Please provide a valid email address.',
			//'string.empty': 'Email is required.',
			//'any.required': 'Email is required.',
		}),
		phone: Joi.string()
			.pattern(/^[0-9]{10}$/)
			//.required()
			.messages({
				'string.base': 'Phone number must be a valid string.',
				//'string.empty': 'Phone number is required.',
				'string.pattern.base': 'Phone number must be a 10-digit number.',
				//'any.required': 'Phone number is required.',
			}),
		activeStatus: Joi.boolean().messages({
			'boolean.base': 'Active status must be true or false.',
		}),
	});

	return schema.validate(data);
};

module.exports = { companyValidation };
