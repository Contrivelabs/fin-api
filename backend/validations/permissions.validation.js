const Joi = require('joi');
const mongoose = require('mongoose');

const permissionValidation = (data) => {
	const schema = Joi.object({
		name: Joi.string().min(3).max(100).required().messages({
			'string.base': 'Permission name must be a string',
			'string.min': 'Permission name must be at least 3 characters',
			'string.max': 'Permission name must be at most 100 characters',
			'any.required': 'Permission name is required',
		}),
		groupName: Joi.string().max(100).required().messages({
			'any.required': 'Group name is required',
		}),
		description: Joi.string().max(255).messages({
			'string.max': 'Description must not exceed 255 characters',
		}),
		activeStatus: Joi.boolean(),
	});

	return schema.validate(data, { abortEarly: false });
};

module.exports = { permissionValidation };
