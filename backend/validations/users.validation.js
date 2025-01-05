const Joi = require('joi');

// Validation Schema for User
const validateUser = (data) => {
	const schema = Joi.object({
		name: Joi.string().min(3).max(50).required().messages({
			'string.base': 'Name must be a string.',
			'string.empty': 'Name is required.',
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
		city: Joi.string().max(100).allow(null, ''),
		collectionRoute: Joi.string().required().messages({
			'any.required': 'Collection route is required.',
		}),
		address: Joi.string().max(255).allow(null, ''),
		idType: Joi.string().valid('Aadhar', 'PAN', 'Passport').allow(null, ''),
		idProof: Joi.string().uri().allow(null, ''),
		additionalNotes: Joi.string().max(500).allow(null, ''),
		otp: Joi.string().max(6).allow(null, ''),
		otpExpireDateTime: Joi.date().allow(null, ''),
		activeStatus: Joi.boolean(),
		role: Joi.string()
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
		userType: Joi.string().valid('customer', 'collector').required().messages({
			'any.required': 'User type is required.',
			'any.only': 'User type must be either "customer" or "collector".',
		}),
	});
	return schema.validate(data, { abortEarly: false });
};

module.exports = { validateUser };
