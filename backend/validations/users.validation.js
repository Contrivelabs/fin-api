const Joi = require('joi');

// Validation Schema for User
const validateUser = (data) => {
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
		collectionRoute: Joi.pattern(/^[a-zA-Z0-9 _\-&]+$/).string().required().messages({
			'any.required': 'Collection route is required.',
			'string.pattern.base': 'Route can only contain letters, numbers, spaces, underscores (_), hyphens (-), and ampersands (&).',
		}),
		address: Joi.string().pattern(/^[a-zA-Z0-9 _\-&]+$/).max(255).allow(null, '').messages({
			'string.pattern.base': 'Address can only contain letters, numbers, spaces, underscores (_), hyphens (-), and ampersands (&).',
		}),
		idType: Joi.string().valid('Aadhar', 'PAN', 'Passport').allow(null, ''),
		idProof: Joi.string().uri().allow(null, ''),
		additionalNotes: Joi.string().pattern(/^[a-zA-Z0-9 _\-&]+$/).max(500).allow(null, '').messages({
			'string.pattern.base': 'Additional notes can only contain letters, numbers, spaces, underscores (_), hyphens (-), and ampersands (&).',
		}),
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


const validateSignUpUser = (data) => {
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
		otp: Joi.string().max(6).allow(null, ''),
		otpExpireDateTime: Joi.date().allow(null, ''),
		activeStatus: Joi.boolean(),
		role: Joi.string()
			.pattern(/^[a-fA-F0-9]{24}$/)
			.messages({
				'string.pattern.base': 'Invalid role format.',
			})
	});
	return schema.validate(data, { abortEarly: false });
};


const validateUserOTP = (data) => {
	const schema = Joi.object({
		primaryPhoneNo: Joi.string()
			.pattern(/^[0-9]{10}$/)
			.required()
			.messages({
				'string.pattern.base':
					'Primary phone number must be a 10-digit number.',
				'string.empty': 'Primary phone number is required.',
				'any.required': 'Primary phone number is required.',
			}),
		otp: Joi.string().max(6).required(),
		userId: Joi.string()
			.pattern(/^[a-fA-F0-9]{24}$/)
			.allow(null, '')
			.messages({
				'string.pattern.base': 'Invalid User ID.',
			})
	});
	return schema.validate(data, { abortEarly: false });
};

const validateUserResendOTP = (data) => {
	const schema = Joi.object({
		primaryPhoneNo: Joi.string()
			.pattern(/^[0-9]{10}$/)
			.required()
			.messages({
				'string.pattern.base':
					'Primary phone number must be a 10-digit number.',
				'string.empty': 'Primary phone number is required.',
				'any.required': 'Primary phone number is required.',
			}),
		userId: Joi.string()
			.pattern(/^[a-fA-F0-9]{24}$/)
			.allow(null, '')
			.messages({
				'string.pattern.base': 'Invalid User ID.',
			})
	});
	return schema.validate(data, { abortEarly: false });
};

const validateSignInUser = (data) => {
const schema = Joi.object({
	from: Joi.string().valid('sign-in').required().messages({
			'any.required': 'From field is required.',
			'any.only': 'From field must be "sign-in".',
		}),
		primaryPhoneNo: Joi.string()
			.pattern(/^[0-9]{10}$/)
			.required()
			.messages({
				'string.pattern.base':
					'Primary phone number must be a 10-digit number.',
				'string.empty': 'Primary phone number is required.',
				'any.required': 'Primary phone number is required.',
			})
	});
	return schema.validate(data, { abortEarly: false });
};

module.exports = { validateUser, validateSignUpUser, validateUserOTP, validateUserResendOTP, validateSignInUser };
